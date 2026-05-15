# 프로젝트 컨텍스트

## 목표
- 영일 회사 웹사이트를 유지보수하고 개선합니다.

## 범위
- 정적 페이지와 공용 프론트엔드 에셋.
- 로컬 미리보기 및 파일 제공을 위한 경량 Node 서버.

## 현재 구조
- `assets/`: CSS, JS, 이미지 및 정적 리소스.
- `data/`: 앱에서 사용하는 로컬 데이터 파일.
- 루트 `*.html`: 페이지 템플릿 및 사이트 진입점.
- `server.js`: 로컬 서버 진입 파일.

## 작업 원칙
- 변경은 단순하고 페이지 안정성을 해치지 않게 진행합니다.
- 페이지 간 시각적 일관성을 유지합니다.
- 작고 리뷰하기 쉬운 단위로 업데이트합니다.


## 운영 메모

- 배포 URL, 호스팅 방식이 정해지면 여기에 요약해 둡니다.

### GitHub 배포/바로가기 운영 규칙

- 원격 저장소 기준: `https://github.com/sensealive/260501_Cursor_YoungilWebsite`
- 정적 페이지 배포 후 `ShortCut` 폴더에 해당 URL 바로가기를 둡니다.
- GitHub Pages 설정 값 변경하기
- 예시 gh api -X POST repos/sensealive/260501_Cursor_YoungilWebsite/pages \
  -f source[branch]=main \
  -f source[path]=/
- 예시 URL: `https://sensealive.github.io/260501_Cursor_YoungilWebsite/index.html`

- 첫 페이지(index.html)는 바로가기 생성후 그 사이트에 접속하여 잘 작동하는지 확인 할 것.
-.url 파일을 항상 ASCII(퍼센트 인코딩) URL만 저장.
- 바로가기 생성후 그 사이트에 접속하여 잘 작동하는지 확인 할 것.

### `git push` 작업 의미

- `sensealive` 계정 하위의 현재 프로젝트 저장소에 커밋과 푸시를 진행합니다.
- 저장소가 아직 없으면 먼저 저장소를 생성한 뒤 커밋/푸시를 진행합니다.

### `git pull` 작업 의미

- 원격 기준: `https://github.com/sensealive/<현재프로젝트명>`
- 로컬 기준 경로: `D:\programming\Cursor\Cusor_Project`
- 해당 로컬 경로로 최신 변경사항을 pull 합니다.
