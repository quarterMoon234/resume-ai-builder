import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// GET /api/profile - 모든 프로필 조회
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .select('basicInfo.name basicInfo.email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      profiles: profiles
    });

  } catch (error) {
    console.error('프로필 목록 조회 오류:', error);

    res.status(500).json({
      success: false,
      message: '프로필 목록 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// POST /api/profile - 프로필 생성
router.post('/', async (req, res) => {
  try {
    // 요청 바디에서 프로필 데이터 받기
    const profileData = req.body;

    // 새 프로필 생성
    const newProfile = new Profile(profileData);

    // MongoDB에 저장
    const savedProfile = await newProfile.save();

    // 성공 응답
    res.status(201).json({
      success: true,
      message: '프로필이 성공적으로 저장되었습니다.',
      profileId: savedProfile._id,
      profile: savedProfile
    });

  } catch (error) {
    console.error('프로필 저장 오류:', error);

    // 에러 응답
    res.status(500).json({
      success: false,
      message: '프로필 저장 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// GET /api/profile/:id - 프로필 조회
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// DELETE /api/profile/:id - 프로필 삭제
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: '프로필을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '프로필이 성공적으로 삭제되었습니다.',
      deletedProfile: {
        id: profile._id,
        name: profile.basicInfo.name,
        email: profile.basicInfo.email
      }
    });

  } catch (error) {
    console.error('프로필 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '프로필 삭제 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
