// Generic board module used by notice.html and media.html.
// Local server mode uses server.js. Static GitHub Pages mode stores edits in this browser.
const _BASE = location.protocol === "file:" ? "http://localhost:3000" : "";
const BOARD_API_PATH = window.BOARD_API || "/api/notices";
const BOARD_API = _BASE + BOARD_API_PATH;
const STATIC_BOARD_FILE = BOARD_API_PATH.includes("/api/media") ? "data/media.json" : "data/notices.json";
const STORAGE_KEY = `youngil-board:${STATIC_BOARD_FILE}`;
const AUTH_KEY = `youngil-board-auth:${STATIC_BOARD_FILE}`;
const IS_NODE_SERVER = ["localhost", "127.0.0.1"].includes(location.hostname) && location.port === "3000";
const STATIC_MODE = !IS_NODE_SERVER;
const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "1741";

let page = 1;
let token = localStorage.getItem(AUTH_KEY) || "";
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

async function loadSeedItems() {
  const res = await fetch(STATIC_BOARD_FILE, { cache: "no-store" });
  if (!res.ok) throw new Error("게시글 데이터를 불러오지 못했습니다.");
  return await res.json();
}

async function loadStaticItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const items = await loadSeedItems();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

function saveStaticItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function paginateItems(items, currentPage, pageSize) {
  const sorted = [...items].sort((a, b) => Number(b.id) - Number(a.id));
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (currentPage - 1) * pageSize;
  return {
    items: sorted.slice(start, start + pageSize),
    page: currentPage,
    pageSize,
    totalCount,
    totalPages
  };
}

async function loadBoardData() {
  if (STATIC_MODE) {
    return paginateItems(await loadStaticItems(), page, 10);
  }

  try {
    return await api(`${BOARD_API}?page=${page}&pageSize=10`);
  } catch {
    return paginateItems(await loadStaticItems(), page, 10);
  }
}

async function loadBoardItem(id) {
  if (!STATIC_MODE) {
    try {
      return await api(`${BOARD_API}/${id}`);
    } catch {
      // Fall back to static data below.
    }
  }

  const items = await loadStaticItems();
  const item = items.find((n) => String(n.id) === String(id));
  if (!item) throw new Error("게시글을 찾을 수 없습니다.");
  return item;
}

async function verifyToken() {
  if (!token) return;

  if (STATIC_MODE) {
    if (token !== "static-admin") {
      token = "";
      localStorage.removeItem(AUTH_KEY);
    }
    return;
  }

  try {
    await api("/api/me");
  } catch {
    token = "";
    localStorage.removeItem(AUTH_KEY);
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
    const data = await loadBoardData();
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
          <td>${n.author || ""}</td>
          <td>${n.date || ""}</td>`;
        body.appendChild(tr);
      });
    }

    body.querySelectorAll(".titleLink").forEach((a) => a.addEventListener("click", onViewItem));
    body.querySelectorAll(".check-col").forEach((td) => {
      if (token) td.classList.remove("hidden");
    });
    renderPagination(data.totalPages);
  } catch {
    const body = qs("#boardBody");
    if (body) body.innerHTML = `<tr><td colspan="5" style="color:#c00;padding:16px;">게시글 데이터를 불러오지 못했습니다.</td></tr>`;
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
    const n = await loadBoardItem(id);
    qs("#editorCard").classList.remove("hidden");
    qs("#editorTitle").textContent = token ? "글 수정" : "내용 보기";
    qs("#itemTitle").value = n.title;
    qs("#itemContent").value = n.content;
    qs("#itemTitle").disabled = !token;
    qs("#itemContent").disabled = !token;
    if (qs("#saveBtn")) qs("#saveBtn").classList.toggle("hidden", !token);
    editingId = Number(id);
    qs("#editorCard").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (e) {
    alert(e.message);
  }
}

async function login() {
  const id = qs("#adminId").value.trim();
  const password = qs("#adminPw").value.trim();
  if (!id || !password) { alert("아이디와 비밀번호를 입력해 주세요."); return; }

  if (STATIC_MODE) {
    if (id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
    token = "static-admin";
    localStorage.setItem(AUTH_KEY, token);
    toggleAdminUI(true);
    await loadBoard();
    return;
  }

  const result = await api("/api/login", { method: "POST", body: JSON.stringify({ id, password }) });
  token = result.token;
  localStorage.setItem(AUTH_KEY, token);
  toggleAdminUI(true);
  await loadBoard();
}

async function logout() {
  if (!STATIC_MODE) {
    try { await api("/api/logout", { method: "POST" }); } catch {}
  }
  token = "";
  localStorage.removeItem(AUTH_KEY);
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

function todayText() {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
}

async function saveItem() {
  const title = qs("#itemTitle").value.trim();
  const content = qs("#itemContent").value.trim();
  if (!title || !content) { alert("제목과 내용을 입력해 주세요."); return; }

  if (STATIC_MODE) {
    const items = await loadStaticItems();
    if (editingId) {
      const idx = items.findIndex((n) => Number(n.id) === Number(editingId));
      if (idx < 0) throw new Error("게시글을 찾을 수 없습니다.");
      items[idx] = { ...items[idx], title, content };
    } else {
      const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      items.push({ id: maxId + 1, title, author: ADMIN_ID, date: todayText(), content });
    }
    saveStaticItems(items);
  } else if (editingId) {
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

  if (STATIC_MODE) {
    const items = await loadStaticItems();
    saveStaticItems(items.filter((n) => !ids.includes(Number(n.id))));
  } else {
    await api(BOARD_API, { method: "DELETE", body: JSON.stringify({ ids }) });
  }
  await loadBoard();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (qs("#adminId")) qs("#adminId").placeholder = "관리자 ID";
  if (qs("#adminPw")) qs("#adminPw").placeholder = "비밀번호";

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
