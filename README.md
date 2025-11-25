# AI 기반 이력서 생성 웹서비스

사용자 프로필을 입력하면 AI가 자동으로 이력서를 생성하는 웹서비스입니다. 기업을 타겟으로 선택하면 맞춤형 이력서를 제공하는 것을 목표로 합니다.

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
│       ├── pages/       # ProfilePage 완료, CompanyTarget/ResumeResult 미구현
│       ├── components/  # Layout 완료
│       ├── App.jsx, main.jsx, index.css
│   ├── vite.config.js   # /api 프록시 → http://localhost:5001
│   └── package.json
├── server/              # 백엔드 (Express)
│   ├── config/          # db.js (MongoDB 연결)
│   ├── routes/          # profile.js 완료, generate.js, company.js (스켈레톤)
│   ├── models/          # Profile.js 완료
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
MongoDB 연결 완료 및 프로필 저장/조회 API 구현 완료

### 3) 클라이언트
```bash
cd client
npm install
npm run dev
```
기본 포트: http://localhost:3000 (Vite, /api 프록시 → http://localhost:5001)

## 현재 상태

### ✅ 완료
- 프로젝트 기본 구조 설정
- 프로필 입력 폼 UI 구현 (8개 섹션: 인적사항, 구직방향, 학력, 경력, 프로젝트, 스킬, 자격증/수상, 자기소개)
- 프로필 저장/조회 API (백엔드 + MongoDB)
- MongoDB 연결 및 Profile 모델 구현

### 🚧 진행 예정
- OpenAI GPT API 연동
- 기본 이력서 생성 기능
- 기업 분석 및 맞춤형 이력서 생성
- PDF 다운로드 기능

## 주요 기능

- [x] 사용자 프로필 입력 폼 (프론트엔드)
- [x] 프로필 데이터 저장 (백엔드 + MongoDB)
- [ ] AI 기반 기본 이력서 생성
- [ ] 타겟 기업 선택 및 분석
- [ ] 기업 맞춤형 이력서 생성
- [ ] 이력서 PDF 다운로드
