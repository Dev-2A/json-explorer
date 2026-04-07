# 🔍 JSON Explorer

JSON 데이터를 트리 구조로 시각화하고, 노드별 접기/펼치기, 실시간 검색, JSONPath 경로 복사를 지원하는 인터랙티브 브라우저 도구입니다.

> [Format Converter](https://github.com/Dev-2A/format-converter)(JSON/YAML/TOML 변환기)의 "보기" 특화 후속작

## 🌐 데모

👉 [https://dev-2a.github.io/json-explorer/](https://dev-2a.github.io/json-explorer/)

## ✨ 주요 기능

- 🌳 **트리 뷰** — JSON 데이터를 재귀적 트리 구조로 시각화
- 🔄 **접기/펼치기** — 노드별 토글, 전체 펼치기/접기, 깊이별 제어 (1~4)
- 🔎 **실시간 검색** — 키/값 동시 검색 + 매칭 하이라이팅 + 자동 펼침
- 📋 **JSONPath 복사** — dot notation / bracket notation 원클릭 복사
- 🎨 **타입별 색상** — string(초록), number(파랑), boolean(노랑), null(회색), key(보라)
- ❌ **구문 에러 표시** — 한국어 에러 메시지 + 줄/열 위치 + 코드 스니펫
- 📂 **다양한 입력** — 텍스트 붙여넣기 / 파일 드래그앤드롭 / 파일 열기 / URL fetch
- 📊 **통계 패널** — 노드 수, 최대 깊이, 타입 분포, 크기 등 구조 분석
- 🖱️ **우클릭 메뉴** — 값 복사 / 압축 복사 / 경로 복사
- ⌨️ **키보드 단축키** — Ctrl+Shift+F(검색), E(전체 펼침), D(전체 접기)
- 📱 **반응형** — 모바일에서 탭 전환 UI 지원

## 🛠️ 기술 스택

| 분류 | 기술 |
| --- | --- |
| 프레임워크 | React 19 + Vite |
| 스타일링 | Tailwind CSS v4 |
| 배포 | GitHub Pages + GitHub Actions |

## 🚀 시작하기

```bash
# 클론
git clone https://github.com/Dev-2A/json-explorer.git
cd json-explorer

# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── CopyToast.jsx         # 복사 피드백 토스트
│   ├── DropZone.jsx          # 파일 드래그앤드롭
│   ├── ErrorBanner.jsx       # JSON 구문 에러 표시
│   ├── HighlightText.jsx     # 검색 매칭 하이라이트
│   ├── InputPanel.jsx        # JSON 입력 패널
│   ├── NodeContextMenu.jsx   # 우클릭 컨텍스트 메뉴
│   ├── PathBar.jsx           # JSONPath 경로 바
│   ├── SearchBar.jsx         # 검색 바
│   ├── StatsPanel.jsx        # 통계 패널
│   ├── TreeNode.jsx          # 재귀적 트리 노드 (핵심)
│   ├── TreeView.jsx          # 트리 뷰 컨테이너
│   ├── UrlFetcher.jsx        # URL fetch 입력
│   └── ValueRenderer.jsx     # 타입별 값 렌더러
├── hooks/
│   ├── useExpandState.js     # 펼침/접기 상태 관리
│   ├── useJsonParser.js      # JSON 파싱 + 에러 처리
│   ├── useKeyboardShortcuts.js # 키보드 단축키
│   └── useSearch.js          # 실시간 검색
├── utils/
│   ├── jsonParser.js         # 상세 에러 분석 파서
│   ├── jsonPath.js           # JSONPath 변환
│   ├── stats.js              # JSON 구조 통계
│   └── typeUtils.js          # 타입 판별 유틸리티
├── App.jsx
├── index.css
└── main.jsx
```

## ⌨️ 단축키

| 단축키 | 기능 |
| --- | --- |
| `Ctrl+Shift+F` | 검색 포커스 |
| `Ctrl+Shift+E` | 전체 펼치기 |
| `Ctrl+Shift+D` | 전체 접기 |
| `우클릭` | 값/경로 복사 메뉴 |

## 📄 라이선스

MIT License
