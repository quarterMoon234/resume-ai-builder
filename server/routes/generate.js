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

// POST /api/generate/basic - 기본 이력서 생성
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

    // 프로필 데이터를 텍스트로 변환
    const profileText = formatProfileForPrompt(profile);

    // OpenAI GPT를 사용하여 이력서 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 10년 경력의 전문 이력서 컨설턴트입니다. 주어진 프로필 정보를 바탕으로 **채용 담당자가 눈여겨볼 만한** 전문적이고 매력적인 한국어 이력서를 작성해주세요.

**절대 규칙 (반드시 준수):**
1. 제공된 정보만 사용하세요. 프로필에 없는 정보는 절대 추가하거나 만들어내지 마세요.
2. 프로필에 경력, 프로젝트, 기술 스택이 없으면 그 섹션을 생략하세요.
3. 추측이나 가정으로 정보를 채우지 마세요.

**작성 원칙:**
1. **성과 중심 작성**: 단순 업무 나열이 아닌, 성과와 결과를 강조하세요.
   - 나쁜 예: "콘텐츠 운영 담당"
   - 좋은 예: "콘텐츠 운영 전략 수립 및 실행을 통해 사용자 참여도 향상"

2. **구체적 표현**: 제공된 정보를 구체적이고 전문적으로 표현하세요.
   - 나쁜 예: "데이터 분석 기초"
   - 좋은 예: "데이터 기반 의사결정을 위한 분석 역량 보유"

3. **액션 동사 사용**: 주도적이고 능동적인 표현을 사용하세요.
   - "수행했습니다", "기여했습니다", "달성했습니다", "개선했습니다", "기획하고 실행했습니다"

4. **전문성 강조**: 경력, 프로젝트, 역량을 전문적으로 포장하세요.
   - 도구/기술은 "활용 가능" 수준이 아닌 "실무 활용 경험" 으로 표현
   - 역할은 "담당"이 아닌 "주도", "리드", "기획 및 실행"으로 표현

5. **간결하고 임팩트 있게**: 불필요한 수식어는 제거하고, 핵심 성과를 명확히 전달하세요.

**이력서 구조:**
1. **개인 정보**: 이름, 연락처, 이메일 (깔끔하게)
2. **전문 요약** (한 줄 소개가 있는 경우): 핵심 역량과 지향점을 2-3줄로 임팩트 있게
3. **핵심 역량**: 키워드를 전문적으로 재구성 (있는 경우만)
4. **경력 사항** (있는 경우):
   - 회사명, 직위, 기간
   - 주요 업무를 성과 중심으로 3-5개 bullet points
   - 구체적 수치나 결과가 있다면 강조
5. **프로젝트 경험** (있는 경우):
   - 프로젝트명, 기간, 역할
   - 주요 성과와 기여도를 명확히
6. **학력**: 학교명, 전공, 학위, 기간 (있는 경우 활동 사항도 포함)
7. **기술 스택 및 도구**: 카테고리별로 정리 (있는 경우만)
8. **자격증 및 수상**: 명확하게 나열 (있는 경우만)

**예시 변환:**
- 입력: "콘텐츠 운영 매니저, 재직 중"
- 출력: "콘텐츠 운영 전략 수립 및 실행, 사용자 경험 개선을 위한 데이터 기반 의사결정 주도"

- 입력: "Figma, Notion 사용"
- 출력: "Figma를 활용한 서비스 기획 및 와이어프레임 제작, Notion 기반 프로젝트 협업 및 문서화 경험"

**중요**: 정보가 없는 섹션은 생략하고, 있는 정보만으로 최대한 전문적이고 매력적인 이력서를 만드세요.`
        },
        {
          role: "user",
          content: profileText
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const generatedResume = completion.choices[0].message.content;

    // MongoDB에 이력서 저장
    const savedResume = new Resume({
      content: generatedResume,
      profileId: profile._id,
      type: 'basic'
    });
    await savedResume.save();

    // 성공 응답
    res.json({
      success: true,
      message: '이력서가 성공적으로 생성되었습니다.',
      resumeId: savedResume._id,
      resume: generatedResume,
      profile: profile
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

// 프로필 데이터를 프롬프트용 텍스트로 변환하는 함수
function formatProfileForPrompt(profile) {
  let text = `다음은 이력서를 작성할 프로필 정보입니다. 없는 정보는 절대 추가하지 마세요.\n\n`;

  // 기본 정보
  text += `=== 기본 정보 ===\n`;
  text += `이름: ${profile.basicInfo.name}\n`;
  text += `이메일: ${profile.basicInfo.email}\n`;
  text += `전화번호: ${profile.basicInfo.phone || '정보 없음'}\n`;
  text += `거주지: ${profile.basicInfo.location || '정보 없음'}\n`;
  if (profile.basicInfo.links && profile.basicInfo.links.length > 0) {
    text += `링크: ${profile.basicInfo.links.map(l => `${l.type}: ${l.url}`).join(', ')}\n`;
  } else {
    text += `링크: 정보 없음\n`;
  }

  // 구직 방향
  text += `\n=== 구직 방향 ===\n`;
  text += `희망 직무: ${profile.jobPreference.desiredPosition || '정보 없음'}\n`;
  text += `경력 구분: ${profile.jobPreference.careerLevel || '정보 없음'}\n`;
  text += `근무 형태: ${profile.jobPreference.workType || '정보 없음'}\n`;
  text += `산업: ${profile.jobPreference.industry || '정보 없음'}\n`;

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
    text += `\n=== 학력 ===\n정보 없음 (이 섹션은 이력서에서 생략하거나 "정보 없음"으로 표시하세요)\n`;
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
    text += `\n=== 경력 ===\n정보 없음 (이 섹션은 이력서에서 생략하거나 "경력 없음"으로 표시하세요)\n`;
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
    text += `\n=== 프로젝트 ===\n정보 없음 (이 섹션은 이력서에서 생략하거나 "프로젝트 경험 없음"으로 표시하세요)\n`;
  }

  // 스킬
  text += `\n=== 기술 및 역량 ===\n`;
  const hasSkills = profile.skills.jobSkills || profile.skills.tools || profile.skills.languages || profile.skills.softSkills;
  if (hasSkills) {
    if (profile.skills.jobSkills) text += `직무 스킬: ${profile.skills.jobSkills}\n`;
    if (profile.skills.tools) text += `도구: ${profile.skills.tools}\n`;
    if (profile.skills.languages) text += `언어: ${profile.skills.languages}\n`;
    if (profile.skills.softSkills) text += `소프트 스킬: ${profile.skills.softSkills}\n`;
  } else {
    text += `정보 없음 (이 섹션은 이력서에서 생략하거나 "기술 정보 없음"으로 표시하세요)\n`;
  }

  // 자격증
  if (profile.certifications && profile.certifications.length > 0) {
    text += `\n=== 자격증 ===\n`;
    profile.certifications.forEach((cert, idx) => {
      text += `${idx + 1}. ${cert.name} (${cert.issuer}, ${cert.date})\n`;
    });
  } else {
    text += `\n=== 자격증 ===\n정보 없음 (이 섹션은 이력서에서 생략하세요)\n`;
  }

  // 수상
  if (profile.awards && profile.awards.length > 0) {
    text += `\n=== 수상 경력 ===\n`;
    profile.awards.forEach((award, idx) => {
      text += `${idx + 1}. ${award.name} (${award.issuer}, ${award.date})\n`;
      if (award.description) text += `   ${award.description}\n`;
    });
  } else {
    text += `\n=== 수상 경력 ===\n정보 없음 (이 섹션은 이력서에서 생략하세요)\n`;
  }

  // 자기소개
  if (profile.summary.oneLine) {
    text += `\n=== 한 줄 소개 ===\n${profile.summary.oneLine}\n`;
  } else {
    text += `\n=== 한 줄 소개 ===\n정보 없음\n`;
  }
  if (profile.summary.keywords) {
    text += `\n=== 키워드 ===\n${profile.summary.keywords}\n`;
  } else {
    text += `\n=== 키워드 ===\n정보 없음\n`;
  }
  if (profile.summary.notes) {
    text += `\n=== 추가 메모 ===\n${profile.summary.notes}\n`;
  }

  return text;
}

// POST /api/generate/custom - 기업 맞춤형 이력서 생성
router.post('/custom', async (req, res) => {
  try {
    const { profileId, companyAnalysis, companyName, companyId } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: '프로필 ID가 필요합니다.'
      });
    }

    if (!companyAnalysis) {
      return res.status(400).json({
        success: false,
        message: '기업 분석 정보가 필요합니다.'
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

    // 프로필 데이터를 텍스트로 변환
    const profileText = formatProfileForPrompt(profile);

    // OpenAI GPT를 사용하여 맞춤형 이력서 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 10년 경력의 채용 컨설턴트이자 이력서 작성 전문가입니다. 주어진 프로필 정보와 타겟 기업 분석을 바탕으로 **해당 기업의 채용 담당자가 반드시 면접 보고 싶게 만드는** 맞춤형 이력서를 작성해주세요.

**절대 규칙 (반드시 준수):**
1. 제공된 프로필 정보만 사용하세요. 프로필에 없는 정보는 절대 추가하거나 만들어내지 마세요.
2. 기업이 요구하는 기술/경험이 프로필에 없으면, 거짓으로 채우지 마세요.
3. 프로필에 경력, 프로젝트, 기술 스택이 없으면 해당 섹션을 생략하세요.

**맞춤형 이력서 작성 전략:**
1. **기업 요구사항 매칭**:
   - 기업 분석에서 요구하는 역량/기술과 프로필의 경험을 연결하세요
   - 프로필의 경험을 기업의 언어로 재해석하세요
   - 예: 기업이 "데이터 기반 의사결정"을 중시 → 프로필의 "데이터 분석" 경험을 "데이터 기반 서비스 개선 및 의사결정 지원"으로 표현

2. **성과와 임팩트 강조**:
   - 프로필의 경력/프로젝트를 기업이 원하는 성과 중심으로 재구성
   - 액션 동사 사용: "주도", "개선", "달성", "기여", "리드"
   - 예: "콘텐츠 운영" → "콘텐츠 운영 전략 수립 및 실행을 통한 사용자 참여도 제고"

3. **기업 문화 반영**:
   - 기업 분석의 문화/가치와 맞는 표현 사용 (프로필 범위 내에서)
   - 기업이 협업을 중시 → 프로필의 팀 프로젝트 경험을 "크로스 펑셔널 협업" 등으로 강조
   - 기업이 혁신을 중시 → 프로필의 개선/제안 경험을 "혁신적 문제 해결" 등으로 표현

4. **우선순위 재배치**:
   - 기업 요구사항과 가장 관련 높은 경험을 먼저 배치
   - 프로필의 모든 정보를 나열하지 말고, 기업에 어필할 내용만 선별

5. **전문성 포장**:
   - 도구/기술: "사용 가능" → "실무 활용 경험 보유"
   - 역할: "담당" → "주도적으로 기획 및 실행"
   - 성과: 구체적 수치나 결과가 없어도 "기여", "개선", "향상" 등으로 표현

**이력서 구조 (기업 맞춤형):**
1. **개인 정보**: 이름, 연락처, 이메일
2. **지원 동기 한 줄** (한 줄 소개 활용): 기업이 원하는 인재상에 부합하도록 재작성
3. **핵심 역량**: 기업 요구사항과 매칭되는 프로필 역량을 우선 배치
4. **경력 사항** (있는 경우):
   - 기업 요구사항과 관련된 업무/성과를 bullet points로 강조
   - 각 경력을 기업의 직무와 연결
5. **프로젝트 경험** (있는 경우):
   - 기업 직무와 관련성 높은 프로젝트를 상세히
   - 프로젝트 성과를 기업이 원하는 역량과 연결
6. **학력**: 학교명, 전공, 학위, 기간 (관련 활동 포함)
7. **기술 스택 및 도구**: 기업 요구 기술을 우선 배치
8. **자격증 및 수상**: 관련성 높은 것 우선

**예시 변환:**
- 기업 요구: "사용자 중심 서비스 운영"
- 프로필: "콘텐츠 운영 매니저, Notion/Figma 사용"
- 출력: "사용자 경험 개선을 위한 콘텐츠 운영 전략 수립 및 실행. Notion 기반 협업 프로세스 구축, Figma 활용 서비스 기획 및 사용자 피드백 반영"

**중요**: 프로필에 없는 정보는 절대 만들지 말고, 있는 정보를 기업에 맞게 최대한 매력적으로 포장하세요.`
        },
        {
          role: "user",
          content: `# 타겟 기업 정보 및 분석\n기업명: ${companyName || '미지정'}\n\n${companyAnalysis}\n\n---\n\n# 지원자 프로필\n${profileText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const generatedResume = completion.choices[0].message.content;

    // MongoDB에 이력서 저장
    const savedResume = new Resume({
      content: generatedResume,
      profileId: profile._id,
      companyId: companyId || null,
      type: 'custom',
      companyName: companyName
    });
    await savedResume.save();

    // 성공 응답
    res.json({
      success: true,
      message: '맞춤형 이력서가 성공적으로 생성되었습니다.',
      resumeId: savedResume._id,
      resume: generatedResume,
      profile: profile,
      companyName: companyName
    });

  } catch (error) {
    console.error('맞춤형 이력서 생성 오류:', error);

    res.status(500).json({
      success: false,
      message: '맞춤형 이력서 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
