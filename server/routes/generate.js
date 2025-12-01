import express from 'express';
import OpenAI from 'openai';
import Profile from '../models/Profile.js';
import Resume from '../models/Resume.js';
import dotenv from 'dotenv';
import { getAllTemplates, getTemplateById, getTemplateMetadata } from '../templates/index.js';

// 환경 변수 로드
dotenv.config();

const router = express.Router();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/generate/basic - 기본 이력서 컨설팅 리포트 생성
router.post('/basic', async (req, res) => {
  try {
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: '프로필 ID가 필요합니다.'
      });
    }

    // 프로필 조회
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    // 프로필 데이터를 프롬프트용 텍스트로 변환
    const profileText = formatProfileForPrompt(profile);

    // 회사 맥락 없이 컨설팅 리포트 생성
    const consultingReport = await generateConsultingAdvice({
      profileText,
      companyContext: null
    });

    if (!consultingReport) {
      return res.status(500).json({
        success: false,
        message: '이력서 컨설팅 리포트 생성에 실패했습니다.'
      });
    }

    // MongoDB에 "이력서 컨설팅" 결과 저장
    const savedResume = new Resume({
      content: consultingReport,
      profileId: profile._id,
      type: 'basic'
    });
    await savedResume.save();

    // 성공 응답
    res.json({
      success: true,
      message: '이력서 컨설팅 리포트가 성공적으로 생성되었습니다.',
      resumeId: savedResume._id,
      resume: consultingReport,
      profile
    });
  } catch (error) {
    console.error('이력서 컨설팅 리포트 생성 오류:', error);

    res.status(500).json({
      success: false,
      message: '이력서 컨설팅 리포트 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 프로필 데이터를 프롬프트용 텍스트로 변환하는 함수
function formatProfileForPrompt(profile) {
  let text = `다음은 이력서/자기소개서 컨설팅을 위한 프로필 정보입니다. 없는 정보는 절대 추가하지 마세요.\n\n`;

  // 기본 정보
  text += `=== 기본 정보 ===\n`;
  text += `이름: ${profile.basicInfo?.name || '정보 없음'}\n`;
  text += `이메일: ${profile.basicInfo?.email || '정보 없음'}\n`;
  text += `전화번호: ${profile.basicInfo?.phone || '정보 없음'}\n`;
  text += `거주지: ${profile.basicInfo?.location || '정보 없음'}\n`;
  if (profile.basicInfo?.links && profile.basicInfo.links.length > 0) {
    text += `링크: ${profile.basicInfo.links.map(l => `${l.type}: ${l.url}`).join(', ')}\n`;
  } else {
    text += `링크: 정보 없음\n`;
  }

  // 구직 방향
  text += `\n=== 구직 방향 ===\n`;
  text += `희망 직무: ${profile.jobPreference?.desiredPosition || '정보 없음'}\n`;
  text += `경력 구분: ${profile.jobPreference?.careerLevel || '정보 없음'}\n`;
  text += `근무 형태: ${profile.jobPreference?.workType || '정보 없음'}\n`;
  text += `산업: ${profile.jobPreference?.industry || '정보 없음'}\n`;

  // 학력
  if (profile.education && profile.education.length > 0) {
    text += `\n=== 학력 ===\n`;
    profile.education.forEach((edu, idx) => {
      text += `${idx + 1}. ${edu.school} - ${edu.major} (${edu.degree})\n`;
      text += `   기간: ${edu.startDate} ~ ${edu.endDate || '재학 중'}\n`;
      if (edu.gpa) text += `   학점: ${edu.gpa}\n`;
      if (edu.description) text += `   설명: ${edu.description}\n`;
    });
  } else {
    text += `\n=== 학력 ===\n정보 없음\n`;
  }

  // 경력
  if (profile.experience && profile.experience.length > 0) {
    text += `\n=== 경력 ===\n`;
    profile.experience.forEach((exp, idx) => {
      text += `${idx + 1}. ${exp.company} - ${exp.position}\n`;
      text += `   기간: ${exp.startDate} ~ ${exp.endDate || '재직 중'}\n`;
      if (exp.description) text += `   업무 내용: ${exp.description}\n`;
    });
  } else {
    text += `\n=== 경력 ===\n정보 없음\n`;
  }

  // 프로젝트
  if (profile.projects && profile.projects.length > 0) {
    text += `\n=== 프로젝트 ===\n`;
    profile.projects.forEach((proj, idx) => {
      text += `${idx + 1}. ${proj.name}\n`;
      text += `   기간: ${proj.startDate} ~ ${proj.endDate || '진행 중'}\n`;
      if (proj.role) text += `   역할: ${proj.role}\n`;
      if (proj.description) text += `   설명: ${proj.description}\n`;
      if (proj.techStack) text += `   기술 스택: ${proj.techStack}\n`;
      if (proj.url) text += `   URL: ${proj.url}\n`;
    });
  } else {
    text += `\n=== 프로젝트 ===\n정보 없음\n`;
  }

  // 스킬
  text += `\n=== 기술 및 역량 ===\n`;
  const hasSkills =
    (profile.skills && (
      profile.skills.jobSkills ||
      profile.skills.tools ||
      profile.skills.languages ||
      profile.skills.softSkills
    ));
  if (hasSkills) {
    if (profile.skills.jobSkills) text += `직무 스킬: ${profile.skills.jobSkills}\n`;
    if (profile.skills.tools) text += `도구: ${profile.skills.tools}\n`;
    if (profile.skills.languages) text += `언어: ${profile.skills.languages}\n`;
    if (profile.skills.softSkills) text += `소프트 스킬: ${profile.skills.softSkills}\n`;
  } else {
    text += `정보 없음\n`;
  }

  // 자격증
  if (profile.certifications && profile.certifications.length > 0) {
    text += `\n=== 자격증 ===\n`;
    profile.certifications.forEach((cert, idx) => {
      text += `${idx + 1}. ${cert.name} (${cert.issuer}, ${cert.date})\n`;
    });
  } else {
    text += `\n=== 자격증 ===\n정보 없음\n`;
  }

  // 수상
  if (profile.awards && profile.awards.length > 0) {
    text += `\n=== 수상 경력 ===\n`;
    profile.awards.forEach((award, idx) => {
      text += `${idx + 1}. ${award.name} (${award.issuer}, ${award.date})\n`;
      if (award.description) text += `   ${award.description}\n`;
    });
  } else {
    text += `\n=== 수상 경력 ===\n정보 없음\n`;
  }

  // 자기소개
  if (profile.summary?.oneLine) {
    text += `\n=== 한 줄 소개 ===\n${profile.summary.oneLine}\n`;
  } else {
    text += `\n=== 한 줄 소개 ===\n정보 없음\n`;
  }
  if (profile.summary?.keywords) {
    text += `\n=== 키워드 ===\n${profile.summary.keywords}\n`;
  } else {
    text += `\n=== 키워드 ===\n정보 없음\n`;
  }
  if (profile.summary?.notes) {
    text += `\n=== 추가 메모 ===\n${profile.summary.notes}\n`;
  }

  return text;
}

// 컨설턴트형 이력서/자소서 전략 리포트 생성
async function generateConsultingAdvice({ profileText, companyContext }) {
  const contextPart = companyContext
    ? `\n\n[지원 회사/직무 정보]\n${companyContext}`
    : '';

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // 필요시 gpt-4.1-mini 등으로 변경
    temperature: 0.3,
    top_p: 0.8,
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content: `너는 취업 준비생을 돕는 "이력서/자기소개서 컨설턴트"이다.

가장 중요한 역할:
- 사용자가 입력한 프로필(경력, 프로젝트, 공모전, 스킬 등)을 분석해서
  1) 강점과 약점,
  2) 전체적인 어필 포인트,
  3) 어떤 내용은 강조하고, 어떤 내용은 줄이거나 숨기는 게 좋은지,
  4) 이력서/자소서/포트폴리오 프레젠테이션의 흐름(스토리라인),
  5) 자기소개서에서 활용할 수 있는 표현 가이드
  를 제안하는 것이다.

절대 하지 말 것:
- 이력서/자기소개서를 대신 작성하지 않는다.
- 사용자의 표현을 완전히 대체하는 "완성본 문장"을 길게 생성하지 않는다.
- 제공되지 않은 경험·성과·직무 내용을 임의로 창작하지 않는다.

출력 형식:
항상 아래 6개 섹션으로 나누어 한국어로 답변한다.

1. 개요
   - 사용자 프로필을 한 문단으로 요약하되, 서술 시제는 현재형이 아니라 ‘완료형(…해왔습니다, …경험을 쌓아왔습니다)’으로 작성한다.
   - “~하고 있습니다 / ~진행 중입니다” 같은 현재진행형 표현은 사용하지 않는다.
   - 어떤 포지션에 적합한지 한 줄로 정리하되, 그 설명 또한 완료형으로 자연스럽게 마무리한다.

2. 강점 & 약점 분석
   - 강점: 3~5개 bullet(근거 포함)
   - 약점/리스크: 3~5개 bullet(이유 + 보완 전략 포함)

     문체 규칙(중요)
   - 강점과 약점/리스크 모두 반드시 존댓말 보고서 문체로 작성합니다.
   - 문장의 끝은 “~합니다”, “~하고 있습니다”, “~되어 있습니다”, “~상황입니다”처럼 정중한 형태로 통일합니다.
   - “~이다”, “~다”, “~부족하다”, “~필요하다”, “~한 상태다” 등의 서술체·반말체는 절대로 사용하지 않습니다.

     절대 하지 말 것
   - 미래 계획을 넣지 않습니다. (“~할 계획입니다”, “~할 예정입니다” 금지)
   - 약점을 과도하게 부정적으로 표현하지 않습니다.
   - 강점과 약점 모두에서 창작/과장 금지(프로필 기반 정보만 사용)

3. 프레젠테이션 전략
   - 서론 이미지 설정
   - 프로젝트/경력 정렬 방식
   - 기술/스킬 강조 전략
   - 이력서 섹션 구성 추천

4. 줄이거나 숨기는 요소
   - 약한 경험, 중복 경험, 직무와 관련성 낮은 내용
   - 간결하게 처리하는 방법까지 제안

5. 문장/표현 예시
   - 직접 작성 시 참고할 수 있는 문장 3~7개 제공
   - 실제 사실을 포함하지 않고 표현 방식만 가이드

6. 1분 자기소개 스피치 예시 (반드시 55~65초 분량)
   - 이 섹션은 마크다운 불릿(-, *, 숫자 목록)을 사용하지 않고, 하나의 스피치 텍스트로 작성한다.
   - 스피치는 2~3개의 문단으로 구성된 연속된 글이어야 하며, 각 문장은 자연스럽게 이어져야 한다.
   - 전체 길이는 55~65초 분량으로, 8~12개의 문장, 최소 380자 이상이 되도록 충분히 길게 작성한다.
   - 경험을 단순 나열하지 말고, ‘어떤 동기로 시작했고, 어떤 경험을 했으며, 무엇을 배우고 성장했는지, 앞으로 어떤 방향을 지향하는지’를 이야기 흐름으로 구성한다.
   - 프로필에 없는 사실·경험·직무를 창작하거나 과장하는 것을 금지한다.
   - 특정 회사명·학교명·직책 등은 프로필에 존재하는 경우에만 자연스럽게 포함하되, 과도히 디테일하게 늘어놓지 않는다.
   - 완성된 자기소개서처럼 딱딱한 문서체가 아니라, 실제 면접 자리에서 말하는 것 같은 구어체에 가깝게 작성한다.

스타일:
- 컨설턴트처럼 정중하고 논리적인 어조
- “이렇게 하세요”보다 “이런 방향을 추천합니다”로 조언
- 사용자의 강점을 적극적으로 재해석해 긍정적으로 전달`
      },
      {
        role: 'user',
        content: `다음은 지원자의 프로필 정보입니다.

[지원자 프로필]
${profileText}

위 프로필을 기반으로, system에서 정의한 1~6번 섹션 형식 그대로 한국어로 답변해 주세요.
특히 6번 스피치는 마크다운 불릿 없이, 하나의 스피치 텍스트(연속된 문단)로 작성해 주세요.`
      }
    ]
  });

  return completion.choices[0]?.message?.content || null;
}

/**
 * POST /api/generate/recommend-template
 * AI가 프로필을 분석하여 최적의 템플릿 추천
 */
router.post('/recommend-template', async (req, res) => {
  try {
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: '프로필 ID가 필요합니다.'
      });
    }

    // 프로필 조회
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    // 프로필 텍스트 변환
    const profileText = formatProfileForPrompt(profile);

    // 템플릿 메타데이터 가져오기
    const templates = getTemplateMetadata();

    // GPT-4o에게 템플릿 추천 요청
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `당신은 이력서 디자인 전문 컨설턴트입니다.
지원자의 프로필을 분석하여 가장 적합한 이력서 템플릿을 추천해주세요.

다음 기준으로 판단하세요:
1. 산업/직무 적합성 - 지원 분야와 템플릿의 스타일이 잘 맞는가?
2. 경력 수준 - 신입/경력에 따른 적절한 레이아웃
3. 강점 부각 - 지원자의 강점을 가장 잘 드러낼 수 있는 구조
4. 전문성 - 해당 산업의 관행과 기대치 부합

응답은 반드시 다음 JSON 형식으로 해주세요:
{
  "recommendedTemplateId": "템플릿ID",
  "reason": "추천 이유 (2-3문장, 한국어)",
  "layoutSuggestion": "이 템플릿을 어떻게 활용하면 좋을지 조언 (1-2문장, 한국어)"
}`
        },
        {
          role: 'user',
          content: `[지원자 프로필]
${profileText}

[사용 가능한 템플릿 목록]
${JSON.stringify(templates, null, 2)}

위 프로필을 분석하여 가장 적합한 템플릿을 추천해주세요.`
        }
      ]
    });

    const responseText = completion.choices[0].message.content;

    // JSON 파싱 (코드 블록 제거)
    let recommendation;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      recommendation = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return res.status(500).json({
        success: false,
        message: 'AI 응답 파싱에 실패했습니다.',
        rawResponse: responseText
      });
    }

    // 추천된 템플릿 가져오기
    const selectedTemplate = getTemplateById(recommendation.recommendedTemplateId);

    if (!selectedTemplate) {
      return res.status(404).json({
        success: false,
        message: '추천된 템플릿을 찾을 수 없습니다.',
        recommendation
      });
    }

    res.json({
      success: true,
      recommendation,
      template: selectedTemplate
    });

  } catch (error) {
    console.error('템플릿 추천 오류:', error);
    res.status(500).json({
      success: false,
      message: '템플릿 추천 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

/**
 * POST /api/generate/generate-with-template
 * 선택된 템플릿으로 이력서 컨텐츠 생성
 */
router.post('/generate-with-template', async (req, res) => {
  try {
    const { profileId, templateId } = req.body;

    if (!profileId || !templateId) {
      return res.status(400).json({
        success: false,
        message: '프로필 ID와 템플릿 ID가 필요합니다.'
      });
    }

    // 프로필 조회
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    // 템플릿 조회
    const template = getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: '템플릿을 찾을 수 없습니다.'
      });
    }

    const profileText = formatProfileForPrompt(profile);

    // 템플릿에 맞는 컨텐츠 생성
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 3500,
      messages: [
        {
          role: 'system',
          content: `당신은 채용 시장에서 10년 이상 경력을 가진 이력서 작성 전문가입니다.

선택된 템플릿: ${template.name} (${template.description})

# 핵심 원칙

당신의 목표는 채용담당자가 6초 안에 "이 사람을 면접에 부르고 싶다"고 느끼게 만드는 임팩트 있는 이력서 초안을 작성하는 것입니다.

## 1. 채용담당자 관점 이해
- 채용담당자는 하루에 수십~수백 개의 이력서를 검토합니다
- 첫 6초 안에 핵심 키워드와 성과를 파악합니다
- 구체적 수치와 정량적 성과에 주목합니다
- 직무 관련성이 명확한 경험을 우선시합니다

## 2. 성과 중심 작성 (STAR 방식)
각 경력/프로젝트 항목은 다음 구조로 작성하세요:
- **Situation**: 어떤 상황/문제였는가? (간결하게)
- **Task**: 어떤 과제를 맡았는가?
- **Action**: 구체적으로 무엇을 했는가? (기술 스택, 방법론 포함)
- **Result**: 어떤 성과를 달성했는가? (정량적 지표 필수)

**좋은 예시:**
"사용자 데이터 분석 대시보드를 React와 D3.js로 구축하여 데이터 조회 시간을 70% 단축하고, 월간 활성 사용자 500명 달성"

**나쁜 예시:**
"대시보드 개발에 참여했습니다"

## 3. 액션 동사 활용
각 문장은 강력한 액션 동사로 시작하세요:
- **개발/구축**: 개발했습니다, 구축했습니다, 설계했습니다, 구현했습니다
- **개선/최적화**: 개선했습니다, 최적화했습니다, 향상시켰습니다, 단축했습니다
- **달성/성과**: 달성했습니다, 증가시켰습니다, 감소시켰습니다, 확보했습니다
- **리드/협업**: 주도했습니다, 리드했습니다, 협업했습니다, 조율했습니다

## 4. 정량적 성과 표현
가능한 모든 성과를 수치화하세요:
- 성능 개선: "응답 속도 2초 → 0.5초로 75% 개선"
- 사용자 증가: "MAU 1,000명 → 5,000명 증가"
- 비용 절감: "서버 비용 월 200만원 → 50만원으로 절감"
- 생산성 향상: "배포 시간 4시간 → 30분으로 단축"

수치가 없는 경우:
- 정성적 성과: "팀 협업 프로세스 개선으로 개발 효율성 대폭 향상"
- 기술적 성과: "확장 가능한 마이크로서비스 아키텍처로 전환"

## 5. 산업별 키워드 최적화
지원자의 직무에 맞는 전문 용어와 기술 스택을 자연스럽게 포함하세요:
- **프론트엔드**: React, TypeScript, Next.js, 반응형 디자인, 웹 접근성, 성능 최적화
- **백엔드**: Node.js, Express, REST API, GraphQL, 데이터베이스 최적화, 마이크로서비스
- **풀스택**: 전체 개발 생명주기, CI/CD, 클라우드 인프라, DevOps
- **데이터**: Python, Pandas, 데이터 분석, 머신러닝, 시각화, SQL

# 섹션별 작성 가이드

## name
- 이름만 정확하게 (텍스트만)

## contact
- 이메일, 전화번호, 거주지를 한 줄로 깔끔하게
- 예: "john@example.com | 010-1234-5678 | 서울특별시 강남구"

## summary (매우 중요!)
이 섹션이 첫인상을 결정합니다. 2-3문장으로 작성하되:
1. 핵심 전문성과 경력 연차
2. 주요 강점과 기술 스택
3. 차별화된 성과나 특징

**좋은 예시:**
"5년 경력의 풀스택 개발자로, React와 Node.js 기반 웹 애플리케이션 개발에 전문성을 보유하고 있습니다. 사용자 중심 UI/UX 설계와 백엔드 API 최적화를 통해 서비스 성능을 평균 40% 이상 개선한 경험이 있으며, 애자일 환경에서 팀과 협업하여 프로젝트를 성공적으로 완수한 이력이 있습니다."

## experienceSection
각 경력 항목을 다음 HTML 구조로 작성:

\`\`\`html
<div class="experience-item" style="margin-bottom: 20px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h4 style="margin: 0; font-weight: bold; font-size: 16px;">회사명 | 직책</h4>
    <span style="color: #666; font-size: 14px;">기간</span>
  </div>
  <ul style="margin-top: 8px; padding-left: 20px;">
    <li style="margin-bottom: 6px;">액션 동사로 시작하는 성과 1 (정량적 지표 포함)</li>
    <li style="margin-bottom: 6px;">액션 동사로 시작하는 성과 2 (기술 스택 포함)</li>
    <li style="margin-bottom: 6px;">액션 동사로 시작하는 성과 3 (구체적 결과)</li>
  </ul>
</div>
\`\`\`

**중요**: 각 bullet은 "~했습니다" 형태의 완료형으로, 성과와 기술 스택을 모두 포함

## projectsSection (있는 경우)
각 프로젝트를 다음 구조로:

\`\`\`html
<div class="project-item" style="margin-bottom: 18px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h4 style="margin: 0; font-weight: bold; font-size: 15px;">프로젝트명</h4>
    <span style="color: #666; font-size: 13px;">기간</span>
  </div>
  <p style="margin: 4px 0; color: #555; font-size: 14px;">역할: [역할]</p>
  <p style="margin: 6px 0; line-height: 1.6;">프로젝트 설명 및 주요 성과 (기술 스택 포함, 정량적 결과 강조)</p>
</div>
\`\`\`

## skillsSection
기술을 카테고리별로 정리하되, 직무 관련성 높은 순서로:

\`\`\`html
<div style="line-height: 1.8;">
  <p style="margin-bottom: 8px;"><strong>프로그래밍 언어:</strong> JavaScript, TypeScript, Python</p>
  <p style="margin-bottom: 8px;"><strong>프레임워크/라이브러리:</strong> React, Node.js, Express</p>
  <p style="margin-bottom: 8px;"><strong>데이터베이스:</strong> MongoDB, PostgreSQL, Redis</p>
  <p style="margin-bottom: 8px;"><strong>도구/인프라:</strong> Git, Docker, AWS, CI/CD</p>
</div>
\`\`\`

## educationSection
\`\`\`html
<div style="margin-bottom: 12px;">
  <div style="display: flex; justify-content: space-between;">
    <strong>학교명</strong>
    <span style="color: #666;">기간</span>
  </div>
  <p style="margin: 4px 0;">전공 | 학위</p>
  <p style="margin: 4px 0; font-size: 14px; color: #555;">주요 활동이나 학점 (있는 경우)</p>
</div>
\`\`\`

## certificationsSection
\`\`\`html
<ul style="list-style: none; padding: 0;">
  <li style="margin-bottom: 8px;">• 자격증명 | 발급기관 | 취득일</li>
</ul>
\`\`\`

# 절대 규칙

1. **프로필에 없는 정보는 절대 생성하지 마세요** - 할루시네이션 금지
2. **없는 섹션은 빈 문자열("")로 반환**
3. **모든 성과는 구체적이고 측정 가능하게** - "많이", "빠르게" 같은 모호한 표현 금지
4. **전문적이고 간결한 문체** - 불필요한 수식어 제거
5. **HTML 인라인 스타일 사용** - 템플릿 디자인과 조화

# 응답 형식

반드시 다음 JSON 형식으로만 응답하세요:

\`\`\`json
{
  "name": "이름",
  "contact": "연락처 정보",
  "summary": "임팩트 있는 2-3문장 요약",
  "experienceSection": "경력 HTML (성과 중심)",
  "skillsSection": "스킬 HTML (카테고리별)",
  "educationSection": "학력 HTML",
  "certificationsSection": "자격증 HTML",
  "projectsSection": "프로젝트 HTML (있는 경우만, 없으면 빈 문자열)",
  "profilePhoto": "사진 URL (있는 경우만, 없으면 빈 문자열)"
}
\`\`\``
        },
        {
          role: 'user',
          content: profileText
        }
      ]
    });

    const responseText = completion.choices[0].message.content;

    // JSON 파싱
    let content;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      content = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      return res.status(500).json({
        success: false,
        message: 'AI 응답 파싱에 실패했습니다.',
        rawResponse: responseText
      });
    }

    // 템플릿과 컨텐츠를 결합한 초기 레이아웃 생성
    const initialLayout = {
      template: template,
      elements: template.layout.elements.map(el => ({
        ...el,
        content: content[el.id] || ''
      }))
    };

    // 컨설팅 리포트도 함께 생성
    const consultingReport = await generateConsultingAdvice({
      profileText,
      companyContext: null
    });

    // Resume 모델에 저장 (layout + consultingReport 모두 포함)
    const resume = new Resume({
      profileId: profile._id,
      type: 'designed',
      templateId: template.id,
      layout: initialLayout,
      content: JSON.stringify(content),
      consultingReport: consultingReport
    });
    await resume.save();

    res.json({
      success: true,
      message: '디자인 이력서와 컨설팅 리포트가 성공적으로 생성되었습니다.',
      resumeId: resume._id,
      initialLayout,
      content,
      consultingReport
    });

  } catch (error) {
    console.error('이력서 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: '이력서 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
