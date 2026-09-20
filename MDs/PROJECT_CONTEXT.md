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

## 요일별 사이트 테마

- 테마 적용 위치: `assets/common.js`
- 적용 함수: `applyDayTheme()`
- 기준: JavaScript `new Date().getDay()` 값
  - `0`: 일요일
  - `1`: 월요일
  - `2`: 화요일
  - `3`: 수요일
  - `4`: 목요일
  - `5`: 금요일
  - `6`: 토요일
- 현재 요일별로 바뀌는 CSS 변수:
  - `--primary`
  - `--bg`
  - `--text`
  - `--primary-soft`
- `--accent`는 요일별 테마에서 변경하지 않으며, 기본값 `#e92229`를 유지한다.

| 요일 | primary | 배경(bg) | 텍스트(text) | soft |
|---|---|---|---|---|
| 월요일 | `#2463eb` 파랑 | `#eef4ff` | `#13233e` | `#dce8ff` |
| 화요일 | `#7b3fe4` 보라 | `#f4efff` | `#231241` | `#ecdcff` |
| 수요일 | `#0a7ca8` 청록/블루 | `#eaf8ff` | `#0b2a36` | `#d2f2ff` |
| 목요일 | `#c49000` 골드 | `#fffae5` | `#3f3200` | `#fff2c2` |
| 금요일 | `#d96a10` 오렌지 | `#fff3ea` | `#3f2108` | `#ffe2c8` |
| 토요일 | `#7a8499` 그레이 | `#f3f4f7` | `#1f2531` | `#e4e6ec` |
| 일요일 | `#c8262d` 레드 | `#ffecef` | `#3b0b0f` | `#ffd5d8` |

## 메인 히어로 배경 이미지

- 현재 메인 히어로 배경 이미지: `assets/yieng/hero-smartfactory-robot.png`
- 적용 위치: `assets/styles.css`의 `.hero` 배경
- `index.html`의 `heroCanvas`는 점/불빛 애니메이션용 캔버스이므로 유지한다.
- 배경 이미지를 교체하거나 보정할 때도 `heroCanvas`는 삭제하지 않는다.
