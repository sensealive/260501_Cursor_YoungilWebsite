# AGENTS.md

영일 회사 웹사이트 — 정적 HTML/CSS/JS + 로컬 미리보기용 경량 Node 서버(`server.js`).

## 주의

- `assets/`(CSS·JS·이미지), `data/`(로컬 데이터), 루트 `*.html`(페이지)가 실제 산출물이다.
- 이 저장소는 PUBLIC이며 GitHub Pages로 공개된다. `MDs/` 문서도 URL로 열람 가능하므로 비공개 정보를 적지 않는다.
- `node_modules/`는 커밋하지 않는다.
- 운영 전 확인 항목(수신 메일 주소 등)은 `MDs/TODO.md`에 남아 있으므로 배포 전 확인한다.

## 작업 후 기록 규칙

- 작업 내역 → `MDs/WORK_LOG.md` (append-only, 과거 항목 수정 금지)
- 구조/스택/정책을 바꾼 결정 → `MDs/DECISIONS.md` (append-only)
- 버그를 만들었거나 고쳤으면 → `MDs/BUGS.md`
- 할 일 변화 → `MDs/TODO.md`
- 반복된 시행착오는 `MDs/PROJECT_LESSONS.md`에 재발 방지 형태로 남긴다.
- 문서에 이미지를 넣을 때는 `MDs/attachments/`에 두고 상대경로로 참조한다.
  (`MDs/`는 Obsidian Vault에 연결되어 있어 폴더 바깥 이미지는 표시되지 않는다.)

## 문서 위치

프로젝트 지식 문서는 모두 `MDs/`에 있다. 작업 시작 전 `MDs/PROJECT_CONTEXT.md`, `MDs/TODO.md`, `MDs/BUGS.md`, `MDs/DECISIONS.md`를 읽는다.
`MDs/`는 Obsidian Vault(`HermesVault/03_Projects/{프로젝트명}`)와 Junction으로 연결되어 있다. 원본은 이 저장소이며 폴더 이름을 바꾸면 연결이 끊긴다.
