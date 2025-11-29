import express from 'express';
import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// POST /api/resume - 이력서 저장
router.post('/', async (req, res) => {
  try {
    const { content, profileId, companyId, type, companyName } = req.body;

    // 필수 필드 검증
    if (!content || !profileId || !type) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다. (content, profileId, type)'
      });
    }

    // type 값 검증
    if (!['basic', 'custom'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'type은 basic 또는 custom이어야 합니다.'
      });
    }

    // 프로필 존재 여부 확인
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    // 이력서 저장
    const newResume = new Resume({
      content,
      profileId,
      companyId: companyId || null,
      type,
      companyName: companyName || null
    });

    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      message: '이력서가 저장되었습니다.',
      resumeId: savedResume._id,
      resume: savedResume
    });
  } catch (error) {
    console.error('이력서 저장 오류:', error);
    res.status(500).json({
      success: false,
      message: '이력서 저장에 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/resume/:id - 이력서 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 이력서 조회 (프로필 정보도 함께)
    const resume = await Resume.findById(id)
      .populate('profileId', 'basicInfo');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '이력서를 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      resume: {
        id: resume._id,
        content: resume.content,
        type: resume.type,
        companyName: resume.companyName,
        templateId: resume.templateId,
        layout: resume.layout,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        profile: resume.profileId,
        company: resume.companyId
      }
    });
  } catch (error) {
    console.error('이력서 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '이력서 조회에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/resume/:id - 이력서 레이아웃 업데이트
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { layout } = req.body;

    if (!layout) {
      return res.status(400).json({
        success: false,
        message: '레이아웃 데이터가 필요합니다.'
      });
    }

    // 이력서 찾기 및 업데이트
    const resume = await Resume.findByIdAndUpdate(
      id,
      { layout, updatedAt: new Date() },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: '이력서를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '이력서가 업데이트되었습니다.',
      resume
    });
  } catch (error) {
    console.error('이력서 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '이력서 업데이트에 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/resume - 이력서 목록 조회 (프로필별)
router.get('/', async (req, res) => {
  try {
    const { profileId } = req.query;

    let query = {};
    if (profileId) {
      query.profileId = profileId;
    }

    const resumes = await Resume.find(query)
      .populate('profileId', 'basicInfo.name basicInfo.email')
      .sort({ createdAt: -1 })
      .select('type createdAt');

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error('이력서 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '이력서 목록 조회에 실패했습니다.',
      error: error.message
    });
  }
});

export default router;
