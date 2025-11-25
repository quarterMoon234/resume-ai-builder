import express from 'express';
import OpenAI from 'openai';
import Profile from '../models/Profile.js';
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
          content: `당신은 전문 이력서 작성 전문가입니다. 주어진 프로필 정보를 바탕으로 한국어로 전문적이고 매력적인 이력서를 작성해주세요.

**중요 규칙:**
- 제공된 정보만 사용하세요. 없는 정보를 임의로 추가하거나 만들어내지 마세요.
- 정보가 없는 섹션은 생략하거나 간단히 언급만 하세요.
- 제공된 정보를 기반으로 전문적으로 재구성하되, 사실을 왜곡하지 마세요.

이력서는 다음 형식을 따라야 합니다:
1. 개인 정보 (이름, 연락처, 이메일)
2. 경력 요약 (한 문단, 제공된 정보를 바탕으로)
3. 학력 (제공된 경우만)
4. 경력/경험 (제공된 경우만)
5. 프로젝트 (제공된 경우만)
6. 기술 스택 및 역량
7. 자격증 및 수상 경력 (제공된 경우만)

각 섹션은 명확하게 구분하고, 전문적이면서도 읽기 쉬운 형식으로 작성해주세요.`
        },
        {
          role: "user",
          content: profileText
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedResume = completion.choices[0].message.content;

    // 성공 응답
    res.json({
      success: true,
      message: '이력서가 성공적으로 생성되었습니다.',
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
  let text = `다음은 이력서를 작성할 프로필 정보입니다:\n\n`;

  // 기본 정보
  text += `=== 기본 정보 ===\n`;
  text += `이름: ${profile.basicInfo.name}\n`;
  text += `이메일: ${profile.basicInfo.email}\n`;
  if (profile.basicInfo.phone) text += `전화번호: ${profile.basicInfo.phone}\n`;
  if (profile.basicInfo.location) text += `거주지: ${profile.basicInfo.location}\n`;
  if (profile.basicInfo.links && profile.basicInfo.links.length > 0) {
    text += `링크: ${profile.basicInfo.links.map(l => `${l.type}: ${l.url}`).join(', ')}\n`;
  }

  // 구직 방향
  text += `\n=== 구직 방향 ===\n`;
  text += `희망 직무: ${profile.jobPreference.desiredPosition || '미정'}\n`;
  text += `경력 구분: ${profile.jobPreference.careerLevel}\n`;
  text += `근무 형태: ${profile.jobPreference.workType}\n`;
  if (profile.jobPreference.industry) text += `산업: ${profile.jobPreference.industry}\n`;

  // 학력
  if (profile.education && profile.education.length > 0) {
    text += `\n=== 학력 ===\n`;
    profile.education.forEach((edu, idx) => {
      text += `${idx + 1}. ${edu.school} - ${edu.major} (${edu.degree})\n`;
      text += `   기간: ${edu.startDate} ~ ${edu.endDate || '재학 중'}\n`;
      if (edu.gpa) text += `   학점: ${edu.gpa}\n`;
      if (edu.description) text += `   설명: ${edu.description}\n`;
    });
  }

  // 경력
  if (profile.experience && profile.experience.length > 0) {
    text += `\n=== 경력 ===\n`;
    profile.experience.forEach((exp, idx) => {
      text += `${idx + 1}. ${exp.company} - ${exp.position}\n`;
      text += `   기간: ${exp.startDate} ~ ${exp.endDate || '재직 중'}\n`;
      if (exp.description) text += `   업무 내용: ${exp.description}\n`;
    });
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
  }

  // 스킬
  text += `\n=== 기술 및 역량 ===\n`;
  if (profile.skills.jobSkills) text += `직무 스킬: ${profile.skills.jobSkills}\n`;
  if (profile.skills.tools) text += `도구: ${profile.skills.tools}\n`;
  if (profile.skills.languages) text += `언어: ${profile.skills.languages}\n`;
  if (profile.skills.softSkills) text += `소프트 스킬: ${profile.skills.softSkills}\n`;

  // 자격증
  if (profile.certifications && profile.certifications.length > 0) {
    text += `\n=== 자격증 ===\n`;
    profile.certifications.forEach((cert, idx) => {
      text += `${idx + 1}. ${cert.name} (${cert.issuer}, ${cert.date})\n`;
    });
  }

  // 수상
  if (profile.awards && profile.awards.length > 0) {
    text += `\n=== 수상 경력 ===\n`;
    profile.awards.forEach((award, idx) => {
      text += `${idx + 1}. ${award.name} (${award.issuer}, ${award.date})\n`;
      if (award.description) text += `   ${award.description}\n`;
    });
  }

  // 자기소개
  if (profile.summary.oneLine) {
    text += `\n=== 한 줄 소개 ===\n${profile.summary.oneLine}\n`;
  }
  if (profile.summary.keywords) {
    text += `\n=== 키워드 ===\n${profile.summary.keywords}\n`;
  }
  if (profile.summary.notes) {
    text += `\n=== 추가 메모 ===\n${profile.summary.notes}\n`;
  }

  return text;
}

// POST /api/generate/custom - 기업 맞춤형 이력서 생성 (미구현)
router.post('/custom', (req, res) => {
  res.json({ message: 'Custom resume generation - to be implemented' });
});

export default router;
