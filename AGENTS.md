# 프로젝트 현황 문서 (AGENTS.md)

**생성일**: 2025-11-25
**최종 업데이트**: 2025-11-25 (Step 2 완료)
**프로젝트명**: AI 기반 이력서 생성 웹서비스
**버전**: 0.2.0 (프로필 저장 기능 완성)

---

## 📋 프로젝트 개요

사용자가 프로필 정보를 입력하면 AI(OpenAI GPT)가 자동으로 이력서를 생성해주는 웹 서비스입니다.
특정 기업을 타겟으로 선택하면 해당 기업에 맞춤화된 이력서를 생성하는 기능도 제공할 예정입니다.

---

## 🏗️ 기술 스택

### Frontend
- **React** 18.2.0
- **Vite** 5.0.8 (빌드 도구)
- **Tailwind CSS** 3.3.6 (스타일링)
- **React Router DOM** 6.20.0 (라우팅)
- **Axios** 1.13.2 (HTTP 클라이언트)

### Backend
- **Node.js** (ES Module 방식)
- **Express** 4.18.2
- **MongoDB** + **Mongoose** 8.0.3
- **OpenAI API** 4.20.1
- **CORS**, **dotenv**

---

## 📂 프로젝트 구조

```
claud-project/
├── client/                     # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ProfilePage.jsx          (942줄) ✅ 완성
│   │   │   ├── CompanyTargetPage.jsx    (18줄) 🚧 미구현
│   │   │   └── ResumeResultPage.jsx     (18줄) 🚧 미구현
│   │   ├── components/
│   │   │   └── Layout.jsx               (30줄) ✅ 완성
│   │   ├── App.jsx                      (21줄) ✅ 완성
│   │   ├── main.jsx                     (10줄) ✅ 완성
│   │   └── index.css                    (11줄) ✅ 완성
│   ├── vite.config.js                   (proxy 설정 포함)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
│
├── server/                     # 백엔드 (Express)
│   ├── config/
│   │   └── db.js                        (13줄) ✅ MongoDB 연결 완성
│   ├── routes/
│   │   ├── profile.js                   (66줄) ✅ CRUD API 완성
│   │   ├── generate.js                  (16줄) 🚧 미구현
│   │   └── company.js                   (13줄) 🚧 미구현
│   ├── models/
│   │   └── Profile.js                   (96줄) ✅ Mongoose 스키마 완성
│   ├── server.js                        (33줄) ✅ MongoDB 연결 추가
│   ├── .env                             ✅ PORT=5001, MongoDB URI
│   └── package.json
│
├── .gitignore                  # 완성 (node_modules, .env 등 포함)
├── .env.example                # 환경 변수 예시
├── README.md                   # 프로젝트 문서
└── AGENTS.md                   # 이 파일
```

**총 코드 라인 수**: 약 1,164줄 (JS/JSX 파일만)

---

## ✅ 구현 완료된 기능

### 1. 프론트엔드 (Client)

#### ✅ 프로필 입력 폼 (ProfilePage.jsx)
- **8개 섹션으로 구성된 전체 프로필 입력 폼 완성**
  1. 인적사항 (이름, 이메일, 연락처, 거주지, 개인 링크)
  2. 구직 방향 (희망 직무, 경력 구분, 근무 형태, 산업/업종)
  3. 학력 (동적 배열 - 추가/삭제 가능)
  4. 경력 (동적 배열 - 추가/삭제 가능)
  5. 프로젝트·활동 (동적 배열 - 추가/삭제 가능)
  6. 역량/스킬 (직무 스킬, 도구, 언어, 소프트 스킬)
  7. 자격증/수상 (동적 배열 - 각각 추가/삭제 가능)
  8. 자기소개·요약 (한 줄 소개, 키워드, 주의사항)

- **상태 관리**: useState 기반 로컬 상태 관리
- **UI/UX**:
  - Tailwind CSS를 활용한 깔끔한 카드 레이아웃
  - 반응형 디자인
  - 필수 필드 표시 (*)
  - 입력 필드 포커스 시 파란색 링 효과

- **주요 기능**:
  - ✅ 프로필 미리보기 버튼 (JSON 출력)
  - ✅ 프로필 저장하기 버튼 (axios로 POST 요청)
  - ✅ 로딩 상태 관리 ("저장 중..." 표시)
  - ✅ 에러 처리 (서버 연결 실패, 서버 오류 등)

#### ✅ 공통 레이아웃 (Layout.jsx)
- 네비게이션 바 포함
- 3개 페이지 간 라우팅 링크
- 공통 헤더 "AI 이력서 생성기"

#### ✅ 라우팅 설정 (App.jsx)
- React Router DOM으로 3개 페이지 라우팅
  - `/` → ProfilePage
  - `/company` → CompanyTargetPage
  - `/result` → ResumeResultPage

#### ✅ 개발 환경 설정
- Vite 개발 서버 (포트 3000)
- API 프록시 설정: `/api` → `http://localhost:5001`
- Tailwind CSS 설정 완료

---

### 2. 백엔드 (Server)

#### ✅ MongoDB 연결 완성
- **config/db.js**: Mongoose 연결 함수
- 로컬 MongoDB 사용: `mongodb://localhost:27017/resume-generator`
- 연결 성공/실패 로그 출력
- 연결 실패 시 서버 자동 종료

#### ✅ Profile 모델 완성 (Mongoose Schema)
- **models/Profile.js**: 전체 프로필 스키마 정의
- 8개 주요 섹션 스키마:
  - basicInfo (이름, 이메일, 연락처, 거주지, 링크 배열)
  - jobPreference (희망 직무, 경력 구분, 근무 형태, 산업)
  - education[] (학력 배열)
  - experience[] (경력 배열)
  - projects[] (프로젝트 배열)
  - skills (직무 스킬, 도구, 언어, 소프트 스킬)
  - certifications[] (자격증 배열)
  - awards[] (수상 배열)
  - summary (한 줄 소개, 키워드, 주의사항)
- timestamps: true (createdAt, updatedAt 자동 생성)
- 필수 필드: basicInfo.name, basicInfo.email

#### ✅ 프로필 API 완성
- **POST /api/profile**: 프로필 저장
  - 요청: 전체 프로필 JSON 데이터
  - 응답: { success, message, profileId, profile }
  - 에러 처리 포함

- **GET /api/profile/:id**: 프로필 조회
  - MongoDB _id로 프로필 검색
  - 404 처리 (프로필 없을 경우)
  - 에러 처리 포함

#### ✅ Express 서버 설정
- CORS 설정
- JSON body parser
- Health check 엔드포인트: `GET /api/health`
- 포트: **5001** (macOS AirPlay와의 포트 충돌 해결)
- MongoDB 연결 자동 실행

#### 🚧 미구현 라우트
- `POST /api/generate/basic` - 기본 이력서 생성 (미구현)
- `POST /api/generate/custom` - 맞춤형 이력서 생성 (미구현)
- `POST /api/company/analyze` - 기업 분석 (미구현)

---

### 3. 기타

#### ✅ Git 설정
- `.gitignore` 완성
  - node_modules, .env, 빌드 결과물, 로그, 캐시 등 제외
  - OS별 파일 (.DS_Store, Thumbs.db 등)
  - IDE 설정 파일

#### ✅ 문서화
- `README.md` 작성 완료
  - 프로젝트 소개
  - 설치 및 실행 방법
  - 현재 상태 및 진행 예정 사항
  - 체크박스로 진행 상황 표시

- `.env.example` 작성
  - OPENAI_API_KEY
  - MONGODB_URI
  - PORT

---

## 🚧 진행 중 / 예정 사항

### Step 2: 백엔드 API 구현 ✅ 완료 (2025-11-25)
- [x] MongoDB 연결 설정 (`config/db.js`)
- [x] Profile 모델 스키마 정의 (Mongoose)
- [x] POST /api/profile 라우트 구현 (프로필 저장)
- [x] GET /api/profile/:id 라우트 구현 (프로필 조회)
- [x] 프론트엔드-백엔드 연동 테스트 완료
- [x] MongoDB에 실제 데이터 저장 확인

### Step 3: AI 이력서 생성 기능
- [ ] OpenAI GPT API 연동
- [ ] 기본 이력서 생성 로직 (`POST /api/generate/basic`)
- [ ] 프롬프트 엔지니어링 (프로필 → 이력서 변환)

### Step 4: 기업 맞춤형 이력서
- [ ] 타겟 기업 입력 페이지 UI (CompanyTargetPage.jsx)
- [ ] 기업 채용 페이지 크롤링/분석 (`POST /api/company/analyze`)
- [ ] 맞춤형 이력서 생성 로직 (`POST /api/generate/custom`)
- [ ] RAG(검색 증강 생성) 스타일 구현 (선택)

### Step 5: 이력서 결과 페이지
- [ ] 생성된 이력서 표시 UI (ResumeResultPage.jsx)
- [ ] 섹션별 표시 (요약, 경력, 프로젝트, 학력, 기술 등)
- [ ] 복사 기능
- [ ] PDF 다운로드 기능 (선택)

### Step 6: 추가 기능
- [ ] 사용자 인증 (회원가입/로그인) - 선택
- [ ] 이력서 히스토리 저장 및 조회
- [ ] 이력서 수정 기능
- [ ] 벡터 DB 도입 (Pinecone, Supabase 등) - 선택

---

## 📊 프로필 데이터 구조

프론트엔드에서 백엔드로 전송되는 JSON 구조:

```javascript
{
  basicInfo: {
    name: string,
    email: string,
    phone: string,
    location: string,
    links: [{ label: string, url: string }]
  },
  jobPreference: {
    desiredPosition: string,
    careerLevel: string,  // 신입/경력/인턴·학생
    workType: string,     // 정규직/계약직/인턴/파트타임
    industry: string
  },
  education: [{
    school: string,
    major: string,
    degree: string,
    period: string,
    activities: string
  }],
  experience: [{
    company: string,
    position: string,
    workType: string,
    period: string,
    duties: string,
    achievements: string
  }],
  projects: [{
    name: string,
    organization: string,
    period: string,
    role: string,
    description: string,
    result: string
  }],
  skills: {
    jobSkills: string,
    tools: string,
    languages: string,
    softSkills: string
  },
  certifications: [{
    name: string,
    issuer: string,
    date: string
  }],
  awards: [{
    name: string,
    issuer: string,
    date: string,
    description: string
  }],
  summary: {
    oneLine: string,
    keywords: string,
    notes: string
  }
}
```

---

## 🔧 개발 환경 실행 방법

### 서버 실행
```bash
cd server
npm install
npm run dev
```
→ http://localhost:5001

### 클라이언트 실행
```bash
cd client
npm install
npm run dev
```
→ http://localhost:3000

---

## 📝 코드 스타일 및 설계 원칙

1. **단순성 우선**: 초보자도 이해 가능한 기본적인 JavaScript/React 코드
2. **과도한 추상화 지양**: 불필요한 헬퍼 함수, 커스텀 훅 최소화
3. **상태 관리**: Redux 등 사용하지 않고 기본 useState로 관리
4. **ES Module 방식**: import/export 사용 (CommonJS 아님)
5. **함수명 명확성**: 기능이 명확히 드러나는 이름 사용

---

## 🐛 알려진 이슈 및 제한사항

1. **백엔드 미완성**:
   - 프론트엔드에서 "프로필 저장하기" 버튼 클릭 시 서버 에러 발생 (정상)
   - MongoDB 연결 및 Profile 모델 미구현

2. **유효성 검사 부족**:
   - 현재 이름과 이메일만 필수 필드 체크
   - 상세한 입력 검증 로직 필요

3. **보안**:
   - 인증/인가 시스템 없음
   - API 보안 미구현

4. **에러 핸들링**:
   - 간단한 alert만 사용
   - 사용자 친화적인 에러 메시지 필요

---

## 📈 진행률

- **전체 프로젝트**: 약 40% 완료
- **프론트엔드**: 약 40% 완료
  - ✅ 프로필 입력 폼 (100%)
  - ✅ 프로필 저장 기능 (100%)
  - 🚧 타겟 기업 페이지 (0%)
  - 🚧 이력서 결과 페이지 (0%)
- **백엔드**: 약 50% 완료
  - ✅ 기본 서버 구조 (100%)
  - ✅ 프로필 API 라우트 (100%)
  - ✅ MongoDB 연동 (100%)
  - ✅ Profile 모델 (100%)
  - 🚧 이력서 생성 API (0%)
  - 🚧 OpenAI 연동 (0%)
  - 🚧 기업 분석 API (0%)

---

## 🎯 다음 마일스톤

### Milestone 1: 프로필 저장 기능 완성 ✅ 완료 (2025-11-25)
- [x] 프론트엔드 저장 버튼 추가
- [x] MongoDB 연결 설정
- [x] Profile 모델 정의
- [x] POST /api/profile 구현
- [x] GET /api/profile/:id 구현
- [x] 프론트-백엔드 연동 테스트
- [x] 실제 데이터 저장 확인

**성과:**
- 프로필 입력 → 저장 → MongoDB 저장 완료
- 포트 충돌 해결 (5000 → 5001)
- 전체 프로필 스키마 정의 완료

### Milestone 2: 기본 이력서 생성 (예정)
- [ ] OpenAI API 키 설정
- [ ] 이력서 생성 프롬프트 작성
- [ ] 기본 이력서 생성 API 구현
- [ ] 결과 페이지 UI 구현

### Milestone 3: 기업 맞춤형 기능 (예정)
- [ ] 기업 정보 입력 페이지
- [ ] 기업 분석 로직
- [ ] 맞춤형 이력서 생성

---

## 💡 기술적 의사결정 기록

1. **Vite 선택 이유**: CRA보다 빠른 개발 서버, 최신 빌드 도구
2. **axios 선택 이유**: fetch보다 간결한 문법, 더 나은 에러 처리
3. **Mongoose 선택 이유**: MongoDB ODM, 스키마 정의 및 유효성 검사 용이
4. **ES Module 방식**: 최신 JavaScript 표준, import/export 사용
5. **로컬 MongoDB 선택**: 개발 단계에서 빠른 접근, 인터넷 불필요
6. **포트 5001 사용**: macOS ControlCenter(AirPlay)가 5000 포트 점유로 인한 변경
7. **timestamps: true**: createdAt, updatedAt 자동 관리로 데이터 추적 용이
8. **_id: false for subdocuments**: 중첩 배열에 불필요한 ID 생성 방지

---

## 📞 참고 정보

- **개발 시작일**: 2025-11-25
- **주요 개발 환경**: macOS (Darwin 24.6.0)
- **Node.js**: ES Module 지원 버전
- **Git**: 저장소 초기화 완료, 첫 커밋 준비 중

---

**문서 끝**
