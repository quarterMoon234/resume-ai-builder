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
│       ├── pages/       # ProfilePage, CompanyTargetPage, ResumeResultPage 모두 완료
│       ├── components/  # Layout 완료
│       ├── App.jsx, main.jsx, index.css
│   ├── vite.config.js   # /api 프록시 → http://localhost:5001
│   └── package.json
├── server/              # 백엔드 (Express)
│   ├── config/          # db.js (MongoDB 연결)
│   ├── routes/          # profile.js, generate.js, company.js 모두 완료
│   ├── models/          # Profile.js, Company.js 완료
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
MongoDB 연결, 프로필 저장/조회 API, AI 이력서 생성 API 구현 완료

### 3) 클라이언트
```bash
cd client
npm install
npm run dev
```
기본 포트: http://localhost:3000 (Vite, /api 프록시 → http://localhost:5001)

## 현재 상태

### ✅ 완료 (v0.5.0)
- 프로젝트 기본 구조 설정
- 프로필 입력 폼 UI 구현 (8개 섹션: 인적사항, 구직방향, 학력, 경력, 프로젝트, 스킬, 자격증/수상, 자기소개)
- 프로필 CRUD API (저장/조회/목록/삭제)
- MongoDB 연결 및 Profile, Company 모델 구현
- **OpenAI GPT-4o-mini API 연동**
- **AI 기반 기본 이력서 생성 기능**
- **기업 채용 페이지 웹 크롤링 (Cheerio)**
- **기업 분석 및 맞춤형 이력서 생성 완료**
- **프로필 관리 기능 (목록 조회, 불러오기, 삭제)**
- **AI 할루시네이션 방지 강화 (Temperature 0.3)**
- **이력서 결과 페이지 완성 (복사 기능, 라우팅 연동)**

### 🚧 진행 예정
- PDF 다운로드 기능
- 이력서 히스토리 관리
- 사용자 인증 (선택)

## 주요 기능

- [x] 사용자 프로필 입력 폼 (프론트엔드)
- [x] 프로필 CRUD 기능 (저장, 조회, 목록, 삭제)
- [x] 프로필 관리 (불러오기, 드롭다운 선택)
- [x] **AI 기반 기본 이력서 생성 (OpenAI GPT-4o-mini)**
- [x] **타겟 기업 채용 페이지 웹 크롤링 (Cheerio)**
- [x] **기업 분석 (OpenAI 기반 5가지 핵심 정보 추출)**
- [x] **기업 맞춤형 이력서 생성**
- [x] **AI 할루시네이션 방지 (Temperature 0.3, 엄격한 프롬프트)**
- [x] **이력서 결과 페이지 (복사 기능, 통계 정보)**
- [ ] 이력서 PDF 다운로드

## 사용 흐름

### 기본 이력서 생성
1. 프로필 정보 입력 (이름, 이메일 필수)
2. "프로필 저장하기" 버튼 클릭 → MongoDB에 저장
3. "AI 이력서 생성" 버튼 활성화
4. 이력서 생성 버튼 클릭 → GPT-4o-mini가 프로필 기반 이력서 생성
5. **자동으로 결과 페이지로 이동** → 생성된 이력서 확인
6. "이력서 복사하기" 버튼으로 원클릭 복사

### 기업 맞춤형 이력서 생성
1. "타겟 기업 맞춤형 이력서" 페이지 이동
2. 기업명, 채용 페이지 URL 입력 (직무 설명은 선택)
3. "기업 분석하기" 버튼 클릭 → 자동 크롤링 + AI 분석
4. 분석 결과 확인 (기업 특징, 요구 역량, 우대 사항 등)
5. 드롭다운에서 저장된 프로필 선택
6. "맞춤형 이력서 생성" 버튼 클릭 → 기업 분석 + 프로필 기반 맞춤형 이력서 생성
7. **자동으로 결과 페이지로 이동** → 맞춤형 이력서 확인
8. "이력서 복사하기" 버튼으로 원클릭 복사
