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

// ── Logo SVG ─────────────────────────────────────
const LOGO_SVG = `<svg width="158" height="48" viewBox="0 0 158 48" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(2,4)">
    <!-- Y shape: left stroke, right stroke, vertical stem -->
    <line x1="6" y1="2" x2="17" y2="16" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="28" y1="2" x2="17" y2="16" stroke="#e92229" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="17" y1="16" x2="17" y2="32" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round"/>
    <!-- arc above Y -->
    <path d="M3,9 Q17,-4 31,9" stroke="#e92229" stroke-width="2" fill="none" stroke-linecap="round"/>
  </g>
  <text x="44" y="28" font-family="'Arial Black',Arial,sans-serif" font-weight="900" font-size="17" fill="var(--primary)" letter-spacing="-0.5">YOUNG IL</text>
  <text x="44" y="42" font-family="Arial,sans-serif" font-size="8.5" fill="#e92229" letter-spacing="1.5">CREATIVE INNOVATION</text>
</svg>`;

// ── Build logo ────────────────────────────────────
function buildLogo() {
  const logoEl = document.querySelector("header .logo");
  if (logoEl) logoEl.innerHTML = LOGO_SVG;
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
