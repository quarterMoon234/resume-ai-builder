# AI 기반 이력서 생성 웹서비스

사용자 프로필을 입력하면 AI가 자동으로 이력서를 생성해주는 서비스입니다.
특정 기업을 타겟으로 선택하면 해당 기업 맞춤형 이력서도 생성할 수 있습니다.

## 기술 스택

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: OpenAI GPT API

## 프로젝트 구조

```
claud-project/
├── client/          # 프론트엔드 (React)
│   ├── src/
│   │   ├── pages/       # 페이지 컴포넌트
│   │   ├── components/  # 공통 컴포넌트
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/          # 백엔드 (Express)
│   ├── routes/      # API 라우트
│   ├── models/      # 데이터 모델
│   ├── server.js
│   └── package.json
├── .env.example
└── README.md
```

## 설치 및 실행 방법

### 1. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성하고 다음 값을 입력하세요:

```
OPENAI_API_KEY=your_actual_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 2. 서버 설치 및 실행

```bash
cd server
npm install
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

### 3. 클라이언트 설치 및 실행

새 터미널에서:

```bash
cd client
npm install
npm run dev
```

클라이언트가 http://localhost:3000 에서 실행됩니다.

## 현재 상태

### ✅ 완료
- 프로젝트 기본 구조 설정
- 프로필 입력 폼 UI 구현 (8개 섹션: 인적사항, 구직방향, 학력, 경력, 프로젝트, 스킬, 자격증/수상, 자기소개)

### 🚧 진행 예정
- 백엔드 API 구현 (프로필 저장/조회)
- MongoDB 연동
- OpenAI GPT API 연동
- 기본 이력서 생성 기능
- 기업 분석 및 맞춤형 이력서 생성
- PDF 다운로드 기능

## 주요 기능

- [x] 사용자 프로필 입력 폼 (프론트엔드)
- [ ] 프로필 데이터 저장 (백엔드 + MongoDB)
- [ ] AI 기반 기본 이력서 생성
- [ ] 타겟 기업 선택 및 분석
- [ ] 기업 맞춤형 이력서 생성
- [ ] 이력서 PDF 다운로드
