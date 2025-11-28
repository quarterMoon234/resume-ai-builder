# 프로젝트 현황 문서 (AGENTS.md)

**생성일**: 2025-11-25
**최종 업데이트**: 2025-11-26 (Step 5 완료)
**프로젝트명**: AI 기반 이력서 생성 웹서비스
**버전**: 0.5.0 (이력서 결과 페이지 완성)

---

## 📋 프로젝트 개요

사용자가 프로필 정보를 입력하면 AI(OpenAI GPT)가 자동으로 이력서를 생성해주는 웹 서비스입니다.
특정 기업을 타겟으로 선택하면 해당 기업에 맞춤화된 이력서를 생성하는 기능을 제공합니다.

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
- **Cheerio** 1.0.0-rc.12 (웹 크롤링)
- **Axios** 1.6.2 (HTTP 클라이언트)
- **CORS**, **dotenv**

---

## 📂 프로젝트 구조

```
claud-project/
├── client/                     # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ProfilePage.jsx          (~500줄) ✅ 완성 (프로필 관리 포함)
│   │   │   ├── CompanyTargetPage.jsx    (295줄) ✅ 완성 (기업 분석 + 맞춤 이력서)
│   │   │   └── ResumeResultPage.jsx     (179줄) ✅ 완성 (이력서 표시 + 복사 기능)
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
│   │   ├── profile.js                   (121줄) ✅ CRUD API 완성 (목록/삭제 포함)
│   │   ├── generate.js                  (296줄) ✅ AI 이력서 생성 완성 (할루시네이션 방지)
│   │   └── company.js                   (204줄) ✅ 기업 분석 API 완성 (크롤링 포함)
│   ├── models/
│   │   ├── Profile.js                   (96줄) ✅ Mongoose 스키마 완성
│   │   └── Company.js                   (31줄) ✅ 기업 분석 스키마 완성
│   ├── server.js                        (33줄) ✅ MongoDB 연결 추가
│   ├── .env                             ✅ PORT=5001, MongoDB URI
│   └── package.json
│
├── .gitignore                  # 완성 (node_modules, .env 등 포함)
├── .env.example                # 환경 변수 예시
├── README.md                   # 프로젝트 문서
└── AGENTS.md                   # 이 파일
```

**총 코드 라인 수**: 약 2,000줄 (JS/JSX 파일만)

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
  - ✅ AI 이력서 생성 버튼 (저장된 프로필 기반)
  - ✅ 생성된 이력서 표시 UI (닫기 기능 포함)
  - ✅ 로딩 상태 관리 ("저장 중...", "이력서 생성 중..." 표시)
  - ✅ 에러 처리 (서버 연결 실패, 서버 오류 등)
  - ✅ 저장된 프로필 목록 조회 및 불러오기
  - ✅ 프로필 삭제 기능 (확인 대화상자 포함)

#### ✅ 공통 레이아웃 (Layout.jsx)
- 네비게이션 바 포함
- 3개 페이지 간 라우팅 링크
- 공통 헤더 "AI 이력서 생성기"

#### ✅ 타겟 기업 페이지 (CompanyTargetPage.jsx)
- **기업 정보 입력 섹션**:
  - 기업명, 채용 페이지 URL (필수)
  - 직무 설명 (선택 - 비어있으면 자동 크롤링)
  - 기업 분석 버튼 (OpenAI 분석)

- **프로필 선택 섹션**:
  - 드롭다운으로 저장된 프로필 선택
  - 자동으로 프로필 목록 불러오기
  - 프로필 없을 경우 안내 메시지

- **맞춤형 이력서 생성**:
  - 기업 분석 결과 + 선택한 프로필로 맞춤형 이력서 생성
  - 생성된 이력서 실시간 표시
  - 닫기 기능 포함

#### ✅ 이력서 결과 페이지 (ResumeResultPage.jsx)
- **이력서 표시 섹션**:
  - 생성된 이력서 전체 내용 표시
  - 기본/맞춤형 이력서 구분 표시
  - 프로필 정보 및 기업명 표시 (맞춤형인 경우)

- **액션 버튼**:
  - 이력서 복사하기 (Clipboard API)
  - 새 이력서 생성 (프로필 페이지로 이동)
  - 기업 맞춤형 이력서 생성 (기업 페이지로 이동)

- **통계 정보**:
  - 이력서 글자 수
  - 예상 읽기 시간
  - 이력서 유형 (기본/맞춤형)

- **사용 안내**:
  - 복사 및 활용 방법 안내
  - AI 생성 내용 검토 권장

#### ✅ 라우팅 설정 (App.jsx)
- React Router DOM으로 3개 페이지 라우팅
  - `/` → ProfilePage
  - `/company` → CompanyTargetPage
  - `/result` → ResumeResultPage (state로 이력서 데이터 전달)

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

- **GET /api/profile**: 모든 프로필 목록 조회
  - 이름, 이메일, 생성일만 선택적으로 반환
  - 최신순 정렬 (createdAt 기준)
  - 프론트엔드 드롭다운용

- **GET /api/profile/:id**: 특정 프로필 조회
  - MongoDB _id로 프로필 검색
  - 404 처리 (프로필 없을 경우)
  - 에러 처리 포함

- **DELETE /api/profile/:id**: 프로필 삭제
  - MongoDB _id로 프로필 삭제
  - 삭제된 프로필 정보 반환
  - 404 처리 포함

#### ✅ Express 서버 설정
- CORS 설정
- JSON body parser
- Health check 엔드포인트: `GET /api/health`
- 포트: **5001** (macOS AirPlay와의 포트 충돌 해결)
- MongoDB 연결 자동 실행

#### ✅ AI 이력서 생성 API 완성
- **POST /api/generate/basic**: 기본 이력서 생성
  - 요청: { profileId }
  - 응답: { success, message, resume, profile }
  - OpenAI GPT-4o-mini 모델 사용
  - 프롬프트 엔지니어링:
    - 시스템 프롬프트: 전문 이력서 작성 전문가 역할
    - 중요 규칙: 제공된 정보만 사용, 없는 정보 임의 생성 금지
    - 정보가 없는 섹션은 생략 또는 "정보 없음" 명시
  - 프로필 데이터를 구조화된 텍스트로 변환 (formatProfileForPrompt)
  - **할루시네이션 방지**: Temperature 0.3, 엄격한 프롬프트 규칙
  - Max tokens: 2000
  - 에러 처리 포함

- **POST /api/generate/custom**: 맞춤형 이력서 생성
  - 요청: { profileId, companyAnalysis, companyName }
  - 응답: { success, message, resume, profile, companyName }
  - 기업 분석 결과와 프로필을 결합하여 맞춤형 이력서 생성
  - **할루시네이션 방지**: Temperature 0.3, 강화된 프롬프트
  - 프로필에 없는 정보는 절대 추가하지 않도록 명시적 지시
  - Max tokens: 2500
  - 에러 처리 포함

#### ✅ 기업 분석 API 완성
- **POST /api/company/analyze**: 기업 채용 페이지 분석
  - 요청: { companyName, jobUrl, jobDescription (선택) }
  - 응답: { success, message, analysis, companyId }
  - **웹 크롤링**: Cheerio + Axios로 채용 페이지 자동 크롤링
    - jobDescription이 없으면 URL에서 자동 추출
    - 다양한 선택자 시도 (.job-description, article, main 등)
    - 5000자 제한, 텍스트 정리 및 정규화
  - **OpenAI 분석**: 크롤링된 내용 + 기업명으로 분석
    - 기업 특징 및 문화
    - 주요 요구 역량 및 기술
    - 우대 사항
    - 직무 설명 및 주요 업무
    - 지원자가 강조해야 할 포인트
  - MongoDB에 분석 결과 저장
  - Temperature: 0.7
  - Max tokens: 1500

- **GET /api/company/:id**: 기업 분석 결과 조회
  - MongoDB _id로 기업 분석 조회
  - 404 처리 포함

#### ✅ Company 모델 완성
- **models/Company.js**: 기업 분석 스키마 정의
- 필드:
  - companyName (기업명)
  - jobUrl (채용 페이지 URL)
  - jobDescription (크롤링 또는 수동 입력)
  - analysis (AI 분석 결과)
  - analyzedAt (분석 시각)
- timestamps: true

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

### Step 3: AI 이력서 생성 기능 ✅ 완료 (2025-11-26)
- [x] OpenAI GPT API 연동 (gpt-4o-mini)
- [x] 기본 이력서 생성 로직 (`POST /api/generate/basic`)
- [x] 프롬프트 엔지니어링 (프로필 → 이력서 변환)
- [x] 프론트엔드 이력서 생성 버튼 및 UI 추가
- [x] 없는 정보를 임의로 생성하지 않도록 프롬프트 개선

### Step 4: 기업 맞춤형 이력서 ✅ 완료 (2025-11-26)
- [x] 타겟 기업 입력 페이지 UI (CompanyTargetPage.jsx)
- [x] 기업 채용 페이지 크롤링/분석 (`POST /api/company/analyze`)
- [x] 맞춤형 이력서 생성 로직 (`POST /api/generate/custom`)
- [x] Company 모델 스키마 정의 (MongoDB)
- [x] Cheerio를 이용한 웹 크롤링 구현
- [x] 프로필 관리 기능 강화 (목록 조회, 드롭다운 선택, 삭제)
- [x] AI 할루시네이션 방지 강화 (Temperature 0.3, 엄격한 프롬프트)

### Step 5: 이력서 결과 페이지 ✅ 완료 (2025-11-26)
- [x] 생성된 이력서 표시 UI (ResumeResultPage.jsx)
- [x] 이력서 전체 내용 표시 (깔끔한 레이아웃)
- [x] 복사 기능 (Clipboard API)
- [x] 라우팅 연동 (React Router state)
- [x] 통계 정보 표시 (글자 수, 읽기 시간, 유형)
- [x] 액션 버튼 (새 이력서 생성, 맞춤형 이력서 생성)

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

1. **유효성 검사 부족**:
   - 현재 이름과 이메일만 필수 필드 체크
   - 상세한 입력 검증 로직 필요

2. **보안**:
   - 인증/인가 시스템 없음
   - API 보안 미구현
   - OpenAI API 키가 서버 코드에 노출 (.env 파일 사용)

3. **에러 핸들링**:
   - 간단한 alert만 사용
   - 사용자 친화적인 에러 메시지 필요

4. **이력서 저장 및 편집**:
   - 생성된 이력서를 수정하거나 저장하는 기능 없음
   - 이력서 히스토리 관리 없음

---

## 📈 진행률

- **전체 프로젝트**: 약 90% 완료
- **프론트엔드**: 약 95% 완료
  - ✅ 프로필 입력 폼 (100%)
  - ✅ 프로필 저장 기능 (100%)
  - ✅ 프로필 관리 기능 (100%) - 목록 조회, 불러오기, 삭제
  - ✅ AI 이력서 생성 버튼 및 표시 UI (100%)
  - ✅ 타겟 기업 페이지 (100%) - 기업 분석 + 맞춤형 이력서
  - ✅ 이력서 결과 페이지 (100%) - 이력서 표시, 복사, 라우팅
- **백엔드**: 약 90% 완료
  - ✅ 기본 서버 구조 (100%)
  - ✅ 프로필 API 라우트 (100%) - CRUD 완성
  - ✅ MongoDB 연동 (100%)
  - ✅ Profile 모델 (100%)
  - ✅ Company 모델 (100%)
  - ✅ 기본 이력서 생성 API (100%)
  - ✅ 맞춤형 이력서 생성 API (100%)
  - ✅ 기업 분석 API (100%) - 웹 크롤링 포함
  - ✅ OpenAI 연동 (100%) - 할루시네이션 방지 포함

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

### Milestone 2: 기본 이력서 생성 ✅ 완료 (2025-11-26)
- [x] OpenAI API 키 설정 (.env 파일)
- [x] 이력서 생성 프롬프트 작성 (시스템 프롬프트 + 사용자 프롬프트)
- [x] 기본 이력서 생성 API 구현 (POST /api/generate/basic)
- [x] 프론트엔드 생성 버튼 및 이력서 표시 UI 구현

**성과:**
- OpenAI GPT-4o-mini 모델 성공적으로 연동
- 프로필 데이터를 구조화된 텍스트로 변환하여 프롬프트 전송
- 없는 정보를 임의로 생성하지 않도록 프롬프트 규칙 추가
- 생성된 이력서를 프론트엔드에서 실시간 표시

### Milestone 3: 기업 맞춤형 이력서 ✅ 완료 (2025-11-26)
- [x] 기업 정보 입력 페이지 (CompanyTargetPage.jsx) 구현
- [x] 웹 크롤링 구현 (Cheerio + Axios)
- [x] 기업 분석 로직 (POST /api/company/analyze)
- [x] 맞춤형 이력서 생성 (POST /api/generate/custom)
- [x] Company 모델 스키마 정의
- [x] 프로필 드롭다운 선택 UI 구현
- [x] AI 할루시네이션 방지 강화

**성과:**
- 채용 페이지 자동 크롤링 성공 (다양한 선택자 지원)
- 크롤링된 내용을 OpenAI로 분석하여 5가지 핵심 정보 추출
- 기업 분석 + 프로필을 결합한 맞춤형 이력서 생성 성공
- Temperature 0.3으로 낮춰 AI가 없는 정보를 임의로 생성하지 않도록 개선
- 프로필 관리 기능 강화 (목록 조회, 불러오기, 삭제)
- 모든 CRUD 작업 프론트-백엔드 연동 완료

### Milestone 4: 이력서 결과 페이지 ✅ 완료 (2025-11-26)
- [x] ResumeResultPage.jsx 구현 (179줄)
- [x] 이력서 전체 내용 표시 (깔끔한 레이아웃)
- [x] 복사 기능 (Clipboard API)
- [x] 라우팅 연동 (React Router state)
- [x] 프로필/기업 페이지에서 결과 페이지로 자동 이동
- [x] 통계 정보 표시 (글자 수, 읽기 시간, 유형)

**성과:**
- React Router의 location.state를 활용한 페이지 간 데이터 전달
- Clipboard API를 활용한 원클릭 복사 기능 구현
- 기본 이력서와 맞춤형 이력서 구분 표시
- 사용자 친화적인 안내 메시지 및 액션 버튼
- 완전한 이력서 생성 플로우 완성 (입력 → 생성 → 결과 표시)

### Milestone 5: 추가 기능 및 개선 (예정)
- [ ] PDF 다운로드 기능
- [ ] 이력서 히스토리 저장 및 조회
- [ ] 사용자 인증 (선택)

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
9. **OpenAI GPT-4o-mini 선택**: GPT-4보다 저렴하고 빠르며 이력서 생성에 충분한 성능
10. **dotenv in generate.js**: OpenAI 클라이언트 초기화 시점에 환경 변수 로드 보장
11. **Cheerio 선택**: 서버사이드 HTML 파싱에 최적화, jQuery 스타일 선택자 지원
12. **Temperature 0.3 사용**: AI 할루시네이션 방지를 위해 낮은 값 설정 (0.7 → 0.3)
13. **명시적 "정보 없음" 마킹**: 프롬프트에 없는 정보를 명시적으로 표시하여 AI가 임의로 생성하지 않도록 함
14. **드롭다운 UI 선택**: 수동 ID 입력 대신 사용자 친화적인 선택 방식 채택
15. **확인 대화상자**: 삭제와 같은 파괴적 작업 전 사용자 확인 필수화
16. **React Router state 활용**: 페이지 간 데이터 전달에 location.state 사용 (URL 파라미터 대신)
17. **Clipboard API 사용**: 원클릭 복사 기능으로 사용자 편의성 향상

---

## 📞 참고 정보

- **개발 시작일**: 2025-11-25
- **주요 개발 환경**: macOS (Darwin 24.6.0)
- **Node.js**: ES Module 지원 버전
- **Git**: 저장소 초기화 완료, 첫 커밋 준비 중

---

## 규칙 (반드시 엄수)
- 한국어만 사용할 것
- 코드는 리팩토링이 필요없을 정도로 작성할 것
- 가독성 좋은 코드로 작성할 것

---

**문서 끝**
