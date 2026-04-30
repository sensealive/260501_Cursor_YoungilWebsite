// Generic board module — used by notice.html (notices API) and media.html (media API)
// Set window.BOARD_API before including this file to override the endpoint.
const _BASE = location.protocol === "file:" ? "http://localhost:3000" : "";
const BOARD_API = _BASE + (window.BOARD_API || "/api/notices");

let page = 1;
let token = localStorage.getItem("adminToken") || "";
let editingId = null;

const qs = (s) => document.querySelector(s);

async function api(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const fullUrl = url.startsWith("http") ? url : _BASE + url;
  const res = await fetch(fullUrl, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "요청에 실패했습니다.");
  return data;
}

// Verify stored token is still valid on page load
async function verifyToken() {
  if (!token) return;
  try {
    await api("/api/me");
  } catch {
    token = "";
    localStorage.removeItem("adminToken");
  }
}

function toggleAdminUI(isAdmin) {
  qs("#adminTools")?.classList.toggle("hidden", !isAdmin);
  qs("#selectHead")?.classList.toggle("hidden", !isAdmin);
  qs("#logoutBtn")?.classList.toggle("hidden", !isAdmin);
  qs("#loginBtn")?.classList.toggle("hidden", isAdmin);
  qs("#adminIdWrap")?.classList.toggle("hidden", isAdmin);
}

async function loadBoard() {
  try {
    const data = await api(`${BOARD_API}?page=${page}&pageSize=10`);
    const body = qs("#boardBody");
    body.innerHTML = "";
    if (data.items.length === 0) {
      body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:#999;">등록된 자료가 없습니다.</td></tr>`;
    } else {
      data.items.forEach((n) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="check-col ${token ? "" : "hidden"}"><input type="checkbox" class="selectItem" value="${n.id}"></td>
          <td>${n.id}</td>
          <td><a href="#" data-id="${n.id}" class="titleLink" style="color:var(--primary)">${n.title}</a></td>
          <td>${n.author}</td>
          <td>${n.date}</td>`;
        body.appendChild(tr);
      });
    }
    body.querySelectorAll(".titleLink").forEach((a) => a.addEventListener("click", onViewItem));
    body.querySelectorAll(".check-col").forEach((td) => {
      if (token) td.classList.remove("hidden");
    });
    renderPagination(data.totalPages);
  } catch (e) {
    const body = qs("#boardBody");
    if (body) body.innerHTML = `<tr><td colspan="5" style="color:#c00;padding:16px;">서버 연결 실패. npm start로 서버를 실행 후 http://localhost:3000으로 접속하세요.</td></tr>`;
  }
}

function renderPagination(totalPages) {
  const el = qs("#pagination");
  if (!el) return;
  el.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const b = document.createElement("button");
    b.className = `btn ${i === page ? "" : "subtle"}`;
    b.textContent = i;
    b.onclick = async () => { page = i; await loadBoard(); };
    el.appendChild(b);
  }
}

async function onViewItem(e) {
  e.preventDefault();
  const id = e.currentTarget.dataset.id;
  try {
    const n = await api(`${BOARD_API}/${id}`);
    qs("#editorCard").classList.remove("hidden");
    qs("#editorTitle").textContent = token ? "글 수정" : "내용 보기";
    qs("#itemTitle").value = n.title;
    qs("#itemContent").value = n.content;
    qs("#itemTitle").disabled = !token;
    qs("#itemContent").disabled = !token;
    if (qs("#saveBtn")) qs("#saveBtn").classList.toggle("hidden", !token);
    editingId = Number(id);
    qs("#editorCard").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (e) { alert(e.message); }
}

async function login() {
  const id = qs("#adminId").value.trim();
  const password = qs("#adminPw").value.trim();
  if (!id || !password) { alert("아이디와 비밀번호를 입력해 주세요."); return; }
  const result = await api("/api/login", { method: "POST", body: JSON.stringify({ id, password }) });
  token = result.token;
  localStorage.setItem("adminToken", token);
  toggleAdminUI(true);
  await loadBoard();
}

async function logout() {
  try { await api("/api/logout", { method: "POST" }); } catch {}
  token = "";
  localStorage.removeItem("adminToken");
  toggleAdminUI(false);
  qs("#editorCard")?.classList.add("hidden");
  loadBoard();
}

function openEditorForNew() {
  editingId = null;
  qs("#editorCard").classList.remove("hidden");
  qs("#editorTitle").textContent = "글 작성";
  qs("#itemTitle").value = "";
  qs("#itemContent").value = "";
  qs("#itemTitle").disabled = false;
  qs("#itemContent").disabled = false;
  if (qs("#saveBtn")) qs("#saveBtn").classList.remove("hidden");
  qs("#itemTitle").focus();
}

async function saveItem() {
  const title = qs("#itemTitle").value.trim();
  const content = qs("#itemContent").value.trim();
  if (!title || !content) { alert("제목과 내용을 입력해 주세요."); return; }
  if (editingId) {
    await api(`${BOARD_API}/${editingId}`, { method: "PUT", body: JSON.stringify({ title, content }) });
  } else {
    await api(BOARD_API, { method: "POST", body: JSON.stringify({ title, content }) });
  }
  qs("#editorCard").classList.add("hidden");
  editingId = null;
  await loadBoard();
}

async function deleteSelected() {
  const ids = [...document.querySelectorAll(".selectItem:checked")].map((el) => Number(el.value));
  if (!ids.length) { alert("삭제할 항목을 선택해 주세요."); return; }
  if (!confirm(`선택한 ${ids.length}개 항목을 삭제하시겠습니까?`)) return;
  await api(BOARD_API, { method: "DELETE", body: JSON.stringify({ ids }) });
  await loadBoard();
}

document.addEventListener("DOMContentLoaded", async () => {
  await verifyToken();
  toggleAdminUI(!!token);

  qs("#loginBtn")?.addEventListener("click", async () => {
    try { await login(); } catch (e) { alert(e.message); }
  });
  qs("#adminPw")?.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") { try { await login(); } catch (err) { alert(err.message); } }
  });
  qs("#logoutBtn")?.addEventListener("click", logout);
  qs("#newBtn")?.addEventListener("click", openEditorForNew);
  qs("#saveBtn")?.addEventListener("click", async () => {
    try { await saveItem(); } catch (e) { alert(e.message); }
  });
  qs("#cancelBtn")?.addEventListener("click", () => qs("#editorCard")?.classList.add("hidden"));
  qs("#deleteSelectedBtn")?.addEventListener("click", async () => {
    try { await deleteSelected(); } catch (e) { alert(e.message); }
  });

  await loadBoard();
});
