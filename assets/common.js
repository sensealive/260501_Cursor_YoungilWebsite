// ── Day theme ────────────────────────────────────
const dayThemes = {
  1: { primary: "#2463eb", bg: "#eef4ff", text: "#13233e", soft: "#dce8ff" },
  2: { primary: "#7b3fe4", bg: "#f4efff", text: "#231241", soft: "#ecdcff" },
  3: { primary: "#0a7ca8", bg: "#eaf8ff", text: "#0b2a36", soft: "#d2f2ff" },
  4: { primary: "#c49000", bg: "#fffae5", text: "#3f3200", soft: "#fff2c2" },
  5: { primary: "#d96a10", bg: "#fff3ea", text: "#3f2108", soft: "#ffe2c8" },
  6: { primary: "#7a8499", bg: "#f3f4f7", text: "#1f2531", soft: "#e4e6ec" },
  0: { primary: "#c8262d", bg: "#ffecef", text: "#3b0b0f", soft: "#ffd5d8" }
};

function applyDayTheme() {
  const day = new Date().getDay();
  const t = dayThemes[day];
  const r = document.documentElement.style;
  r.setProperty("--primary", t.primary);
  r.setProperty("--bg", t.bg);
  r.setProperty("--text", t.text);
  r.setProperty("--primary-soft", t.soft);
}

// ── Navigation menu map ───────────────────────────
const menuMap = [
  {
    label: "회사소개", href: "about.html",
    items: [
      ["CEO 인사말", "about-ceo.html"],
      ["기업문화", "about-culture.html"],
      ["CI", "about-ci.html"],
      ["연혁", "about-history.html"],
      ["조직도", "about-org.html"],
      ["찾아오시는길", "about-location.html"]
    ]
  },
  {
    label: "사업소개", href: "business.html",
    items: [
      ["사업현황", "business-status.html"],
      ["사업분야", "business-field.html"],
      ["특허 및 인증", "business-patent.html"],
      ["고객사", "business-clients.html"]
    ]
  },
  {
    label: "인재채용", href: "recruit.html",
    items: [
      ["인재상", "recruit-talent.html"],
      ["복리후생", "recruit-benefits.html"]
    ]
  },
  {
    label: "고객센터", href: "customer.html",
    items: [
      ["공지사항", "notice.html"],
      ["언론보도", "media.html"],
      ["Contact Us", "contact.html"]
    ]
  }
];

// ── Logo ─────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJsAAABCCAYAAABAUKRrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJFNDMyRDNFN0NCQTExRUI4M0RGRUQxMkZGNUE1QTk1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJFNDMyRDNGN0NCQTExRUI4M0RGRUQxMkZGNUE1QTk1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkU0MzJEM0M3Q0JBMTFFQjgzREZFRDEyRkY1QTVBOTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkU0MzJEM0Q3Q0JBMTFFQjgzREZFRDEyRkY1QTVBOTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4gsfcQAAAQj0lEQVR42uxd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";
const LOGO_HTML = `<img class="site-logo-img" src="${LOGO_SRC}" alt="YOUNG IL CREATIVE INNOVATION">`;

// ── Build logo ────────────────────────────────────
function buildLogo() {
  const logoEl = document.querySelector("header .logo");
  if (logoEl) logoEl.innerHTML = LOGO_HTML;
}

// ── Build dropdown nav ────────────────────────────
function buildDropdownMenu() {
  const header = document.querySelector("header");
  const nav = header?.querySelector("nav");
  if (!header || !nav || header.querySelector(".gnb-dropdown")) return;

  const dropdown = document.createElement("div");
  dropdown.className = "gnb-dropdown";
  const inner = document.createElement("div");
  inner.className = "gnb-inner";
  inner.innerHTML = menuMap.map((group) => `
    <div class="gnb-col">
      <a class="gnb-col-title" href="${group.href}">${group.label}</a>
      ${group.items.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
    </div>`).join("");
  dropdown.appendChild(inner);
  header.appendChild(dropdown);

  // Update top-nav hrefs
  const topLabels = Object.fromEntries(menuMap.map((g) => [g.label, g.href]));
  nav.querySelectorAll("a").forEach((a) => {
    const h = topLabels[a.textContent.trim()];
    if (h) a.setAttribute("href", h);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => header.classList.add("menu-open"));
    link.addEventListener("focus", () => header.classList.add("menu-open"));
  });
  header.addEventListener("mouseleave", () => header.classList.remove("menu-open"));
}

// ── Active nav highlight ──────────────────────────
function setActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a, .gnb-dropdown a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
}

// ── Back-to-top button ────────────────────────────
function buildBackToTop() {
  const btn = document.createElement("button");
  btn.id = "backToTop";
  btn.innerHTML = "▲";
  btn.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:999;
    width:42px;height:42px;border-radius:50%;
    border:none;background:var(--primary);color:#fff;
    font-size:16px;cursor:pointer;
    box-shadow:0 4px 12px rgba(0,0,0,.25);
    opacity:0;transition:opacity .3s;`;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 300 ? "1" : "0";
  });
}

// ── Protocol warning for board pages ─────────────
function checkProtocol() {
  // no-op: file:// protocol is handled transparently via absolute URL base
}

// ── Init ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyDayTheme();
  buildLogo();
  buildDropdownMenu();
  setActiveNav();
  buildBackToTop();
  if (document.querySelector("#loginBtn, #boardWrap")) checkProtocol();
});

