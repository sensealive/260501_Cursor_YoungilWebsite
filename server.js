const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.txt");
const NOTICE_FILE = path.join(DATA_DIR, "notices.json");
const MEDIA_FILE = path.join(DATA_DIR, "media.json");
const SESSION_FILE = path.join(DATA_DIR, "sessions.json");

app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer || "";
  const allowed = origin === "" || origin.startsWith("http://localhost") || origin.startsWith("file://") || origin === "null";
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json());
app.use(express.static(ROOT));

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ADMIN_FILE)) fs.writeFileSync(ADMIN_FILE, "admin:1741", "utf8");
  if (!fs.existsSync(NOTICE_FILE)) {
    const seed = [
      { id: 5, title: "2025년 주주총회 소집", author: "yiengil9", date: "2025.02.21", content: "2025년 주주총회 소집 공고입니다." },
      { id: 4, title: "2024년 주주총회 소집", author: "yiengil9", date: "2024.03.14", content: "2024년 주주총회 소집 공고입니다." },
      { id: 3, title: "2023년 주주총회 소집 - 이사 선임", author: "yiengil9", date: "2023.03.17", content: "2023년 주주총회 소집 및 이사 선임 공고입니다." },
      { id: 2, title: "2022년 주주총회 소집 - 이사 선임", author: "yiengil9", date: "2022.09.05", content: "2022년 주주총회 소집 및 이사 선임 공고입니다." },
      { id: 1, title: "[회사공고] 주식분할 및 주권제출공고 (2021.08.19.)", author: "관리자", date: "2021.08.19", content: "주식분할 및 주권제출공고 안내입니다." }
    ];
    fs.writeFileSync(NOTICE_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
  if (!fs.existsSync(MEDIA_FILE)) {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(SESSION_FILE)) {
    fs.writeFileSync(SESSION_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

function loadAdmin() {
  const raw = fs.readFileSync(ADMIN_FILE, "utf8").trim();
  const colonIdx = raw.indexOf(":");
  const id = raw.slice(0, colonIdx);
  const password = raw.slice(colonIdx + 1);
  return { id, password };
}

function loadSessions() {
  try { return JSON.parse(fs.readFileSync(SESSION_FILE, "utf8")); } catch { return {}; }
}

function saveSessions(s) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(s, null, 2), "utf8");
}

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const sessions = loadSessions();
  if (!token || !sessions[token]) return res.status(401).json({ message: "로그인이 필요합니다." });
  req.user = sessions[token];
  next();
}

function makeBoard(file) {
  return {
    load: () => JSON.parse(fs.readFileSync(file, "utf8")),
    save: (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8")
  };
}

function registerBoardRoutes(app, prefix, board) {
  app.get(prefix, (req, res) => {
    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.max(1, Number(req.query.pageSize || 10));
    const items = board.load().sort((a, b) => b.id - a.id);
    const totalCount = items.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = (page - 1) * pageSize;
    res.json({ items: items.slice(start, start + pageSize), page, pageSize, totalCount, totalPages });
  });

  app.get(`${prefix}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const item = board.load().find((n) => n.id === id);
    if (!item) return res.status(404).json({ message: "항목을 찾을 수 없습니다." });
    res.json(item);
  });

  app.post(prefix, auth, (req, res) => {
    const items = board.load();
    const maxId = items.reduce((m, n) => Math.max(m, n.id), 0);
    const now = new Date();
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const next = { id: maxId + 1, title: req.body.title?.trim() || "", content: req.body.content?.trim() || "", author: req.user.id, date };
    if (!next.title || !next.content) return res.status(400).json({ message: "제목과 내용을 입력해 주세요." });
    items.push(next);
    board.save(items);
    res.status(201).json(next);
  });

  app.put(`${prefix}/:id`, auth, (req, res) => {
    const id = Number(req.params.id);
    const items = board.load();
    const idx = items.findIndex((n) => n.id === id);
    if (idx < 0) return res.status(404).json({ message: "항목을 찾을 수 없습니다." });
    items[idx] = { ...items[idx], title: req.body.title?.trim() || items[idx].title, content: req.body.content?.trim() || items[idx].content };
    board.save(items);
    res.json(items[idx]);
  });

  app.delete(prefix, auth, (req, res) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.map(Number) : [];
    if (!ids.length) return res.status(400).json({ message: "삭제할 항목을 선택해 주세요." });
    const items = board.load();
    const filtered = items.filter((n) => !ids.includes(n.id));
    board.save(filtered);
    res.json({ deleted: items.length - filtered.length });
  });
}

app.post("/api/login", (req, res) => {
  const { id, password } = req.body || {};
  const admin = loadAdmin();
  if (id !== admin.id || password !== admin.password) return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const sessions = loadSessions();
  sessions[token] = { id };
  saveSessions(sessions);
  res.json({ token, id });
});

app.get("/api/me", (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const sessions = loadSessions();
  if (!token || !sessions[token]) return res.status(401).json({ message: "로그인이 필요합니다." });
  res.json({ id: sessions[token].id });
});

app.post("/api/logout", (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const sessions = loadSessions();
  delete sessions[token];
  saveSessions(sessions);
  res.json({ ok: true });
});

registerBoardRoutes(app, "/api/notices", makeBoard(NOTICE_FILE));
registerBoardRoutes(app, "/api/media", makeBoard(MEDIA_FILE));

ensureDataFiles();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
