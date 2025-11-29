# AI 기반 이력서 컨설팅 웹서비스

사용자 프로필을 입력하면 AI가 자동으로 이력서/자기소개서 컨설팅 리포트를 생성하는 웹서비스입니다. 전문 컨설턴트 관점에서 강점/약점 분석, 프레젠테이션 전략, 표현 가이드를 제공합니다.

## 기술 스택

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Axios
- **Backend**: Node.js(ESM) + Express
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI GPT API

## 프로젝트 구조

```
claud-project/
├── client/              # 프론트엔드 (React + Vite)
│   └── src/
│       ├── pages/       # ProfilePage, ResumeHistoryPage, ResumeResultPage 완료
│       ├── components/  # Layout 완료
│       ├── App.jsx, main.jsx, index.css
│   ├── vite.config.js   # /api 프록시 → http://localhost:5001
│   └── package.json
├── server/              # 백엔드 (Express)
│   ├── config/          # db.js (MongoDB 연결)
│   ├── routes/          # profile.js, generate.js, resume.js 완료
│   ├── models/          # Profile.js, Resume.js 완료
│   ├── server.js        # 기본 서버 및 /api/health
│   └── package.json
├── .env.example
├── AGENTS.md            # 프로젝트 현황 문서
└── README.md
```

## 설치 및 실행

### 1) 환경 변수
루트에 `.env`를 생성하고 아래 값을 채웁니다.
```
OPENAI_API_KEY=your_actual_api_key
MONGODB_URI=mongodb://localhost:27017/resume-generator
PORT=5001
```

### 2) 서버
```bash
cd server
npm install
npm run dev
```
기본 포트: http://localhost:5001
MongoDB 연결, 프로필 저장/조회 API, AI 컨설팅 리포트 생성 API, 이력서 히스토리 API 구현 완료

### 3) 클라이언트
```bash
cd client
npm install
npm run dev
```
기본 포트: http://localhost:3000 (Vite, /api 프록시 → http://localhost:5001)

## 현재 상태

### ✅ 완료 (v0.6.0)
- 프로젝트 기본 구조 설정
- 프로필 입력 폼 UI 구현 (8개 섹션: 인적사항, 구직방향, 학력, 경력, 프로젝트, 스킬, 자격증/수상, 자기소개)
- 프로필 CRUD API (저장/조회/목록/삭제)
- MongoDB 연결 및 Profile, Resume 모델 구현
- **OpenAI GPT-4o-mini API 연동 (Temperature 0.3)**
- **AI 기반 컨설팅 리포트 생성 (6개 섹션 구조화)**
- **프로필 관리 기능 (목록 조회, 불러오기, 삭제)**
- **이력서 히스토리 페이지 (생성된 리포트 목록 조회)**
- **이력서 결과 페이지 완성 (복사 기능, 라우팅 연동)**
- **AI 할루시네이션 방지 (Temperature 0.3, 엄격한 프롬프트)**

### 🚧 진행 예정
- PDF 다운로드 기능
- 리포트 편집 기능
- 사용자 인증 (선택)

## 주요 기능

- [x] 사용자 프로필 입력 폼 (프론트엔드)
- [x] 프로필 CRUD 기능 (저장, 조회, 목록, 삭제)
- [x] 프로필 관리 (불러오기, 드롭다운 선택)
- [x] **AI 기반 컨설팅 리포트 생성 (OpenAI GPT-4o-mini)**
- [x] **6개 섹션 구조화 (개요, 강점/약점, 전략, 숨길 요소, 표현 예시, 1분 스피치)**
- [x] **이력서 히스토리 페이지 (생성된 리포트 목록 및 통계)**
- [x] **AI 할루시네이션 방지 (Temperature 0.3, 엄격한 프롬프트)**
- [x] **이력서 결과 페이지 (복사 기능, 통계 정보)**
- [ ] 리포트 PDF 다운로드
- [ ] 리포트 편집 기능

## 사용 흐름

### 컨설팅 리포트 생성
1. 프로필 정보 입력 (이름, 이메일 필수)
2. "프로필 저장하기" 버튼 클릭 → MongoDB에 저장
3. "AI 리포트 생성" 버튼 활성화
4. 리포트 생성 버튼 클릭 → GPT-4o-mini가 프로필 기반 컨설팅 리포트 생성
5. **자동으로 결과 페이지로 이동** → 생성된 리포트 확인
   - 섹션 1: 개요 (완료형 서술)
   - 섹션 2: 강점 & 약점 분석 (존댓말 보고서 문체)
   - 섹션 3: 프레젠테이션 전략
   - 섹션 4: 줄이거나 숨기는 요소
   - 섹션 5: 문장/표현 예시
   - 섹션 6: 1분 자기소개 스피치 (55~65초, 380자 이상)
6. "이력서 복사하기" 버튼으로 원클릭 복사

### 이력서 히스토리 조회
1. "이력서 히스토리" 페이지 이동
2. 생성된 모든 리포트 목록 확인
3. 통계 정보 확인 (총 리포트 수, 기본/맞춤형 개수)
4. 원하는 리포트 클릭 → 결과 페이지로 이동
