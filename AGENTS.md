# 프로젝트 현황 문서 (AGENTS.md)

**생성일**: 2025-11-25
**최종 업데이트**: 2025-11-29 (통합 시스템 완료)
**프로젝트명**: AI 기반 이력서 생성 & 컨설팅 웹서비스
**버전**: 0.7.0 (디자인 이력서 + 컨설팅 리포트 통합, 드래그 앤 드롭 에디터 구현)

---

## 📋 프로젝트 개요

사용자가 프로필 정보를 입력하면 AI(OpenAI GPT)가 **이력서**와 **컨설팅 리포트**를 동시에 생성해주는 올인원 웹 서비스입니다.

**핵심 특징:**
- **통합 생성**: 한 번의 클릭으로 디자인 이력서 + 컨설팅 리포트 동시 생성
- **드래그 앤 드롭 에디터**: 이력서 요소를 자유롭게 이동, 크기 조절, 편집
- **3단 레이아웃**: 툴바(속성 편집) + 캔버스(이력서 편집) + 컨설팅 패널(전문가 조언)
- **AI 템플릿 추천**: 프로필 분석 기반 최적 템플릿 자동 선택
- **로딩 페이지**: 채용공고 캐러셀로 대기 시간 활용
- **전문 컨설팅**: 강점/약점 분석, 프레젠테이션 전략, 표현 가이드, 1분 자기소개 스피치

---

## 🏗️ 기술 스택

### Frontend
- **React** 18.2.0
- **Vite** 5.0.8 (빌드 도구)
- **Tailwind CSS** 3.3.6 (스타일링)
- **React Router DOM** 6.20.0 (라우팅)
- **Axios** 1.13.2 (HTTP 클라이언트)
- **React DnD** 16.0.1 (드래그 앤 드롭)
- **React DnD HTML5 Backend** 16.0.1

### Backend
- **Node.js** (ES Module 방식)
- **Express** 4.18.2
- **MongoDB** + **Mongoose** 8.0.3
- **OpenAI API** 4.20.1
- **Puppeteer** 21.5.2 (PDF 생성)
- **Axios** 1.6.2 (HTTP 클라이언트)
- **CORS**, **dotenv**

---

## 📂 프로젝트 구조

```
claud-project/
├── client/                              # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ProfilePage.jsx          (~450줄) ✅ 프로필 입력 & 관리
│   │   │   ├── LoadingJobsPage.jsx      (262줄) ✅ 로딩 페이지 (채용공고 캐러셀)
│   │   │   ├── ResumeEditorPage.jsx     (239줄) ✅ 드래그 앤 드롭 에디터 (3단 레이아웃)
│   │   │   ├── ResumeHistoryPage.jsx    (198줄) ✅ 이력서 히스토리 목록
│   │   │   └── ResumeResultPage.jsx     (179줄) ✅ 컨설팅 리포트 결과
│   │   ├── components/
│   │   │   ├── Layout.jsx               (27줄) ✅ 공통 레이아웃
│   │   │   ├── ConsultingPanel.jsx      (86줄) ✅ 컨설팅 패널 (사이드바)
│   │   │   ├── EditorToolbar.jsx        (~200줄) ✅ 에디터 툴바 (스타일 편집)
│   │   │   └── DraggableElement.jsx     (~150줄) ✅ 드래그 가능한 요소
│   │   ├── templates/
│   │   │   └── index.js                 ✅ 템플릿 정의 (3개)
│   │   ├── App.jsx                      (27줄) ✅ 라우팅 설정
│   │   ├── main.jsx                     (10줄) ✅ 엔트리 포인트
│   │   └── index.css                    (11줄) ✅ 전역 스타일
│   ├── vite.config.js                   ✅ Proxy 설정
│   ├── tailwind.config.js               ✅ Tailwind 설정
│   ├── postcss.config.js                ✅ PostCSS 설정
│   └── package.json
│
├── server/                              # 백엔드 (Express)
│   ├── config/
│   │   └── db.js                        (13줄) ✅ MongoDB 연결
│   ├── routes/
│   │   ├── profile.js                   (121줄) ✅ 프로필 CRUD API
│   │   ├── generate.js                  (~450줄) ✅ AI 생성 (템플릿 추천 + 이력서 + 컨설팅)
│   │   ├── resume.js                    (133줄) ✅ 이력서 CRUD API (컨설팅 리포트 포함)
│   │   ├── pdf.js                       (~100줄) ✅ PDF 생성 API
│   │   └── template.js                  (~50줄) ✅ 템플릿 조회 API
│   ├── models/
│   │   ├── Profile.js                   (96줄) ✅ 프로필 스키마
│   │   └── Resume.js                    (51줄) ✅ 이력서 스키마 (consultingReport 추가)
│   ├── templates/
│   │   ├── index.js                     ✅ 템플릿 시스템
│   │   ├── modern.js                    ✅ 모던 템플릿
│   │   ├── classic.js                   ✅ 클래식 템플릿
│   │   └── creative.js                  ✅ 크리에이티브 템플릿
│   ├── server.js                        (40줄) ✅ 서버 설정
│   ├── .env                             ✅ 환경 변수
│   └── package.json
│
├── .gitignore                           ✅ Git 제외 파일
├── .env.example                         ✅ 환경 변수 예시
├── README.md                            ✅ 프로젝트 문서
└── AGENTS.md                            ✅ 프로젝트 현황 문서
```

**총 코드 라인 수**: 약 2,800줄 (JS/JSX 파일만)

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
  - ✅ **통합 AI 이력서 생성 버튼** (디자인 + 컨설팅 동시 생성)
  - ✅ 로딩 상태 관리 ("저장 중..." 표시)
  - ✅ 에러 처리 (서버 연결 실패, 서버 오류 등)
  - ✅ 저장된 프로필 목록 조회 및 불러오기
  - ✅ 프로필 삭제 기능 (확인 대화상자 포함)

#### ✅ 로딩 페이지 (LoadingJobsPage.jsx)
- **채용공고 캐러셀**:
  - 6개 샘플 채용공고 자동 슬라이드 (2.5초 간격)
  - 회사, 직무, 지역, 연봉, 기술 스택 정보 표시
  - 인디케이터로 현재 공고 위치 표시

- **진행률 표시**:
  - 4단계 프로그레스 바 (0% → 30% → 60% → 90% → 100%)
  - 단계별 상태 메시지 (템플릿 추천 → 이력서 생성 → 컨설팅 분석)
  - 단계별 체크마크 표시

- **API 통합**:
  - 1단계: AI 템플릿 추천 API 호출
  - 2단계: 템플릿 기반 이력서 생성 API 호출
  - 3단계: 컨설팅 리포트 생성 API 호출
  - 4단계: Resume에 컨설팅 리포트 저장
  - 완료 후 에디터 페이지로 자동 이동

#### ✅ 드래그 앤 드롭 에디터 (ResumeEditorPage.jsx)
- **3단 레이아웃 구조**:
  - 왼쪽: EditorToolbar (요소 속성 편집)
  - 중앙: 캔버스 (A4 이력서 편집 영역)
  - 오른쪽: ConsultingPanel (컨설팅 리포트)

- **주요 기능**:
  - ✅ 요소 드래그 앤 드롭 (React DnD)
  - ✅ 요소 크기 조절 (리사이징)
  - ✅ 실시간 내용 편집 (더블클릭)
  - ✅ 스타일 편집 (폰트, 색상, 크기, 정렬)
  - ✅ 줌 기능 (50% ~ 150%)
  - ✅ 자동 저장
  - ✅ PDF 다운로드 버튼
  - ✅ 컨설팅 패널 토글 (접기/펼치기)

#### ✅ 컨설팅 패널 (ConsultingPanel.jsx)
- **패널 기능**:
  - 접기/펼치기 애니메이션 (w-96 ↔ w-12)
  - 컨설팅 리포트 전체 내용 표시
  - 복사 버튼 (Clipboard API)
  - 닫기 버튼
  - Sticky 헤더

- **UI/UX**:
  - pre-formatted 텍스트로 리포트 표시
  - 활용 팁 섹션
  - 부드러운 transition 효과

#### ✅ 공통 레이아웃 (Layout.jsx)
- 네비게이션 바 포함
- 페이지 간 라우팅 링크
- 공통 헤더 "AI 이력서 생성기"

#### ✅ 이력서 히스토리 페이지 (ResumeHistoryPage.jsx)
- **히스토리 목록 섹션**:
  - MongoDB에 저장된 모든 컨설팅 리포트 조회
  - 프로필 정보 표시 (이름, 이메일)
  - 생성 일시 표시

- **통계 정보**:
  - 총 리포트 수
  - 기본 이력서 개수
  - 맞춤형 이력서 개수 (현재 0개)

- **리포트 클릭**:
  - 리포트 클릭 시 결과 페이지로 이동
  - React Router를 통한 자연스러운 네비게이션

#### ✅ 이력서 결과 페이지 (ResumeResultPage.jsx)
- **리포트 표시 섹션**:
  - 생성된 컨설팅 리포트 전체 내용 표시
  - 6개 섹션 구조화된 형식으로 표시
  - 프로필 정보 표시

- **액션 버튼**:
  - 리포트 복사하기 (Clipboard API)
  - 새 리포트 생성 (프로필 페이지로 이동)

- **통계 정보**:
  - 리포트 글자 수
  - 예상 읽기 시간
  - 리포트 유형 (기본)

- **사용 안내**:
  - 복사 및 활용 방법 안내
  - AI 생성 내용 검토 권장

#### ✅ 라우팅 설정 (App.jsx)
- React Router DOM으로 6개 페이지 라우팅
  - **레이아웃 없이 전체 화면 사용**:
    - `/editor/:resumeId` → ResumeEditorPage (드래그 앤 드롭 에디터)
    - `/loading` → LoadingJobsPage (채용공고 캐러셀)
  - **레이아웃 포함**:
    - `/` → ProfilePage (프로필 입력 & 관리)
    - `/history` → ResumeHistoryPage (이력서 목록)
    - `/result/:id` → ResumeResultPage (컨설팅 리포트 결과)

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

#### ✅ AI 생성 API 완성 (generate.js)
- **POST /api/generate/recommend-template**: AI 템플릿 추천
  - 요청: { profileId }
  - 응답: { success, template, reason }
  - OpenAI GPT-4o-mini 모델 사용
  - 프로필 분석 기반 최적 템플릿 추천 (Modern/Classic/Creative)
  - 추천 이유 제공
  - Temperature 0.5 (창의적 판단 필요)

- **POST /api/generate/generate-with-template**: 템플릿 기반 이력서 생성
  - 요청: { profileId, templateId }
  - 응답: { success, resumeId, initialLayout, template }
  - 선택된 템플릿 적용하여 이력서 레이아웃 생성
  - 프로필 데이터를 템플릿 요소에 매핑
  - MongoDB에 Resume 문서 생성 (type: 'designed')
  - 에러 처리 포함

- **POST /api/generate/basic**: 컨설팅 리포트 생성
  - 요청: { profileId }
  - 응답: { success, message, resumeId, resume, profile }
  - OpenAI GPT-4o-mini 모델 사용
  - 프롬프트 엔지니어링:
    - 시스템 프롬프트: 이력서/자기소개서 컨설턴트 역할
    - 6개 섹션 구조화:
      1. 개요 (완료형 서술)
      2. 강점 & 약점 분석 (존댓말 보고서 문체)
      3. 프레젠테이션 전략
      4. 줄이거나 숨기는 요소
      5. 문장/표현 예시
      6. 1분 자기소개 스피치 (55~65초, 380자 이상)
    - 중요 규칙: 제공된 정보만 사용, 없는 정보 임의 생성 금지
  - 프로필 데이터를 구조화된 텍스트로 변환 (formatProfileForPrompt)
  - **할루시네이션 방지**: Temperature 0.3, 엄격한 프롬프트 규칙
  - Max tokens: 3000
  - MongoDB에 자동 저장 (Resume 모델, type: 'basic')
  - 에러 처리 포함

#### ✅ 이력서 CRUD API 완성 (resume.js)
- **POST /api/resume**: 이력서 저장
  - 요청: { content, profileId, type, companyId, companyName }
  - 응답: { success, message, resumeId, resume }
  - type 검증: 'basic' | 'custom' | 'designed'
  - 에러 처리 포함

- **GET /api/resume**: 모든 이력서 조회
  - 응답: { success, resumes }
  - MongoDB에서 모든 Resume 문서 조회
  - Profile 정보 populate (이름, 이메일)
  - 최신순 정렬 (createdAt 기준)
  - 에러 처리 포함

- **GET /api/resume/:id**: 특정 이력서 조회
  - 응답: { success, resume }
  - MongoDB _id로 이력서 검색
  - **consultingReport 필드 포함** (컨설팅 리포트 데이터)
  - Profile 정보 populate
  - 404 처리 포함

- **PUT /api/resume/:id**: 이력서 레이아웃 및 컨설팅 리포트 업데이트
  - 요청: { layout?, consultingReport? }
  - 응답: { success, message, resume }
  - **동적 필드 업데이트** (layout과 consultingReport 중 제공된 것만 업데이트)
  - 에러 처리 포함

#### ✅ 템플릿 시스템 완성
- **GET /api/template**: 모든 템플릿 조회
  - 응답: { success, templates }
  - 3개 템플릿 반환: Modern, Classic, Creative
  - 메타데이터 포함 (id, name, description, category, style, color)

- **GET /api/template/:id**: 특정 템플릿 조회
  - 응답: { success, template }
  - 템플릿 ID로 검색
  - 404 처리 포함

- **템플릿 구조** (templates/):
  - **modern.js**: 모던 템플릿 (심플, 전문적, 블루 톤)
  - **classic.js**: 클래식 템플릿 (전통적, 엄격함, 그레이 톤)
  - **creative.js**: 크리에이티브 템플릿 (혁신적, 자유로움, 퍼플 톤)
  - 각 템플릿은 layout (width, height)과 elements 배열 정의

#### ✅ PDF 생성 API 완성 (pdf.js)
- **POST /api/pdf/generate**: 이력서 PDF 변환
  - 요청: { layout }
  - 응답: PDF 파일 (binary)
  - Puppeteer로 HTML → PDF 변환
  - A4 사이즈, 여백 제거
  - Content-Type: application/pdf
  - Content-Disposition: attachment

#### ✅ Resume 모델 완성
- **models/Resume.js**: 이력서 저장 스키마 정의
- 필드:
  - content (AI 생성 리포트 내용)
  - profileId (Profile 참조)
  - type (이력서 유형: 'basic' | 'custom' | 'designed')
  - companyId (Company 참조, 기본값 null)
  - companyName (기업명, 기본값 null)
  - **templateId** (템플릿 ID, 기본값 null)
  - **layout** (이력서 레이아웃 객체, 기본값 null)
  - **consultingReport** (컨설팅 리포트 내용, 기본값 null)
- timestamps: true (생성/수정 시각 자동 관리)

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

### Step 4: 이력서 결과 페이지 ✅ 완료 (2025-11-26)
- [x] 생성된 이력서 표시 UI (ResumeResultPage.jsx)
- [x] 이력서 전체 내용 표시 (깔끔한 레이아웃)
- [x] 복사 기능 (Clipboard API)
- [x] 라우팅 연동 (React Router state → URL 파라미터)
- [x] 통계 정보 표시 (글자 수, 읽기 시간, 유형)

### Step 5: 이력서 히스토리 ✅ 완료 (2025-11-28)
- [x] Resume 모델 스키마 정의 (MongoDB)
- [x] Resume API 구현 (GET /api/resume, GET /api/resume/:id)
- [x] ResumeHistoryPage.jsx 구현 (목록 조회)
- [x] 통계 정보 표시 (총 개수, 기본/맞춤형 구분)
- [x] MongoDB 자동 저장 (리포트 생성 시)

### Step 6: 서비스 단순화 ✅ 완료 (2025-11-28)
- [x] 기업 맞춤형 이력서 기능 제거
  - Company 모델, company.js 라우트 삭제
  - CompanyTargetPage.jsx 삭제
  - /custom 엔드포인트 제거
  - Cheerio 웹 크롤링 관련 코드 제거
- [x] 컨설팅 리포트 형식으로 프롬프트 개선
  - 6개 섹션 구조화 (개요, 강점/약점, 전략, 숨길 요소, 표현 예시, 1분 스피치)
  - 완료형 서술, 존댓말 보고서 문체 적용
  - Temperature 0.3 유지

### Step 7: 드래그 앤 드롭 이력서 에디터 ✅ 완료 (2025-11-29)
- [x] 템플릿 시스템 구현 (3개 템플릿: Modern, Classic, Creative)
- [x] AI 템플릿 추천 API (프로필 분석 기반)
- [x] 템플릿 기반 이력서 생성 API
- [x] 드래그 앤 드롭 에디터 구현 (React DnD)
- [x] 요소 크기 조절 및 편집 기능
- [x] EditorToolbar 컴포넌트 (스타일 편집)
- [x] PDF 다운로드 API (Puppeteer)

### Step 8: 통합 시스템 완성 ✅ 완료 (2025-11-29)
- [x] 로딩 페이지 구현 (채용공고 캐러셀, 진행률 표시)
- [x] 3단 레이아웃 에디터 (툴바 + 캔버스 + 컨설팅 패널)
- [x] ConsultingPanel 컴포넌트 (사이드바)
- [x] Resume 모델에 consultingReport 필드 추가
- [x] PUT /api/resume/:id 동적 업데이트 구현
- [x] 통합 생성 플로우 (디자인 + 컨설팅 동시 생성)

### Step 9: 추가 기능 (예정)
- [ ] 템플릿 추가 (현재 3개 → 10개 이상)
- [ ] 리포트 편집 기능
- [ ] 사용자 인증 (회원가입/로그인)
- [ ] 클라우드 배포 (Vercel + MongoDB Atlas)
- [ ] 벡터 DB 도입 (선택)

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

4. **리포트 편집 기능**:
   - 생성된 리포트를 수정하는 기능 없음
   - 현재는 읽기 전용 (복사 후 외부에서 편집 필요)

---

## 📈 진행률

- **전체 프로젝트**: 약 98% 완료
- **프론트엔드**: 100% 완료 (핵심 기능)
  - ✅ 프로필 입력 폼 (100%)
  - ✅ 프로필 관리 기능 (100%) - CRUD 완성
  - ✅ 로딩 페이지 (100%) - 채용공고 캐러셀, 진행률 표시
  - ✅ 드래그 앤 드롭 에디터 (100%) - 3단 레이아웃
  - ✅ ConsultingPanel 컴포넌트 (100%) - 접기/펼치기
  - ✅ 통합 생성 플로우 (100%) - 디자인 + 컨설팅
  - ✅ 이력서 히스토리 페이지 (100%)
  - ✅ 이력서 결과 페이지 (100%)
- **백엔드**: 98% 완료 (핵심 기능)
  - ✅ MongoDB 연결 (100%)
  - ✅ 프로필 API (100%) - CRUD 완성
  - ✅ AI 생성 API (100%) - 템플릿 추천, 이력서 생성, 컨설팅 리포트
  - ✅ 이력서 API (100%) - CRUD + consultingReport 통합
  - ✅ 템플릿 시스템 (100%) - 3개 템플릿
  - ✅ PDF 생성 API (100%) - Puppeteer
  - ✅ OpenAI 연동 (100%) - 할루시네이션 방지

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

### Milestone 3: 이력서 결과 페이지 ✅ 완료 (2025-11-26)
- [x] ResumeResultPage.jsx 구현 (179줄)
- [x] 리포트 전체 내용 표시 (깔끔한 레이아웃)
- [x] 복사 기능 (Clipboard API)
- [x] 라우팅 연동 (React Router state → URL 파라미터)
- [x] 통계 정보 표시 (글자 수, 읽기 시간, 유형)

**성과:**
- React Router의 URL 파라미터를 활용한 페이지 간 데이터 전달
- Clipboard API를 활용한 원클릭 복사 기능 구현
- 사용자 친화적인 안내 메시지 및 액션 버튼
- 완전한 리포트 생성 플로우 완성 (입력 → 생성 → 결과 표시)

### Milestone 4: 이력서 히스토리 ✅ 완료 (2025-11-28)
- [x] Resume 모델 스키마 정의 (MongoDB)
- [x] Resume API 구현 (GET /api/resume, GET /api/resume/:id)
- [x] ResumeHistoryPage.jsx 구현 (198줄)
- [x] 통계 정보 표시 (총 개수, 기본/맞춤형 구분)
- [x] MongoDB 자동 저장 (리포트 생성 시)

**성과:**
- MongoDB에 생성된 리포트 자동 저장
- 히스토리 페이지에서 모든 리포트 목록 조회
- 리포트 클릭 시 결과 페이지로 자연스러운 네비게이션
- Profile 정보 populate로 사용자 정보 자동 표시

### Milestone 5: 서비스 단순화 ✅ 완료 (2025-11-28)
- [x] 기업 맞춤형 이력서 기능 제거 (3개 파일 삭제, 8개 파일 수정)
- [x] 컨설팅 리포트 형식으로 프롬프트 개선
- [x] 6개 섹션 구조화 (개요, 강점/약점, 전략, 숨길 요소, 표현 예시, 1분 스피치)
- [x] 완료형 서술, 존댓말 보고서 문체 적용

**성과:**
- 서비스 복잡도 대폭 감소, 유지보수성 향상
- 코드 라인 수 약 200줄 감소 (2,000줄 → 1,800줄)
- 컨설턴트 관점의 전문적인 리포트 생성
- Temperature 0.3 유지로 할루시네이션 방지

### Milestone 6: 드래그 앤 드롭 이력서 에디터 ✅ 완료 (2025-11-29)
- [x] 템플릿 시스템 구현 (Modern, Classic, Creative)
- [x] AI 템플릿 추천 API 구현
- [x] 템플릿 기반 이력서 생성 API 구현
- [x] React DnD 기반 드래그 앤 드롭 에디터 구현
- [x] 요소 크기 조절 (리사이징) 기능
- [x] EditorToolbar 컴포넌트 (스타일 편집)
- [x] DraggableElement 컴포넌트 (더블클릭 편집)
- [x] PDF 생성 API (Puppeteer)

**성과:**
- 전문적인 디자인 이력서 생성 기능 완성
- 사용자가 자유롭게 이력서 레이아웃 커스터마이징 가능
- AI가 프로필 분석하여 최적의 템플릿 자동 추천
- A4 사이즈 이력서를 PDF로 다운로드 가능
- 코드 라인 수: 약 1,000줄 추가 (1,800줄 → 2,800줄)

### Milestone 7: 통합 시스템 완성 ✅ 완료 (2025-11-29)
- [x] LoadingJobsPage 구현 (채용공고 캐러셀, 진행률 표시)
- [x] 3단 레이아웃 에디터 (툴바 + 캔버스 + 컨설팅 패널)
- [x] ConsultingPanel 컴포넌트 (사이드바, 접기/펼치기)
- [x] Resume 모델에 consultingReport 필드 추가
- [x] PUT /api/resume/:id 동적 업데이트 구현
- [x] 통합 생성 플로우 (디자인 + 컨설팅 동시 생성)
- [x] ProfilePage 버튼 통합 (하나의 버튼으로 통합)

**성과:**
- **한 번의 클릭으로 디자인 이력서 + 컨설팅 리포트 동시 생성**
- 사용자 대기 시간 활용 (채용공고 캐러셀)
- 이력서 편집하면서 실시간으로 컨설팅 조언 확인 가능
- 완전한 올인원 이력서 생성 시스템 구축
- 사용자 경험 대폭 개선

### Milestone 8: 추가 기능 및 개선 (예정)
- [ ] 템플릿 추가 (현재 3개 → 10개 이상)
- [ ] 리포트 편집 기능
- [ ] 사용자 인증 시스템
- [ ] 클라우드 배포 (Vercel + MongoDB Atlas)

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
11. **Temperature 0.3 사용**: AI 할루시네이션 방지를 위해 낮은 값 설정, 일관성 유지
12. **명시적 "정보 없음" 마킹**: 프롬프트에 없는 정보를 명시적으로 표시하여 AI가 임의로 생성하지 않도록 함
13. **확인 대화상자**: 삭제와 같은 파괴적 작업 전 사용자 확인 필수화
14. **React Router URL 파라미터 활용**: 페이지 간 데이터 전달에 `:id` 파라미터 사용 (새로고침 시에도 유지)
15. **Clipboard API 사용**: 원클릭 복사 기능으로 사용자 편의성 향상
17. **6개 섹션 구조화**: 개요, 강점/약점, 전략, 숨길 요소, 표현 예시, 1분 스피치로 체계화
18. **기업 맞춤 기능 제거**: 서비스 복잡도 감소, 핵심 기능에 집중, 유지보수성 향상
19. **MongoDB 자동 저장**: 리포트 생성 시 Resume 모델에 자동 저장하여 히스토리 관리
20. **React DnD 선택**: HTML5 Backend 사용, 브라우저 기본 드래그 앤 드롭 API 활용
21. **템플릿 시스템 도입**: 프로필별 맞춤형 디자인 제공, 확장 가능한 구조
22. **Puppeteer for PDF**: 서버 사이드 PDF 생성, 높은 품질과 정확한 레이아웃 재현
23. **3단 레이아웃 설계**: 툴바 + 캔버스 + 컨설팅 패널로 최적의 UX 제공
24. **로딩 페이지 채용공고 캐러셀**: 대기 시간을 가치있게 활용, 이탈률 감소
25. **통합 생성 플로우 채택**: 3개 API를 순차 호출하여 완전한 이력서 생성 자동화
26. **동적 필드 업데이트 (PUT)**: layout과 consultingReport를 선택적으로 업데이트 가능
27. **Temperature 0.5 for 템플릿 추천**: 창의적 판단이 필요한 템플릿 추천에는 높은 Temperature 사용

---

## 📞 참고 정보

- **개발 시작일**: 2025-11-25
- **최종 업데이트**: 2025-11-29
- **주요 개발 환경**: macOS (Darwin 24.6.0)
- **Node.js**: ES Module 지원 버전
- **Git**: 저장소 관리 중, 정기적 커밋 및 푸시

---

## 규칙 (반드시 엄수)
- 한국어만 사용할 것
- 코드는 리팩토링이 필요없을 정도로 작성할 것
- 가독성 좋은 코드로 작성할 것

---

**문서 끝**
