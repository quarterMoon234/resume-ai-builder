import express from 'express';
import OpenAI from 'openai';
import Profile from '../models/Profile.js';
import Resume from '../models/Resume.js';
import dotenv from 'dotenv';

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
      type: 'basic', // 필요하다면 'consulting_basic' 등으로 스키마에 맞게 변경
      companyId: null,
      companyName: null
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

export default router;
