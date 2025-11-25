import express from 'express';

const router = express.Router();

// 나중에 프로필 CRUD API를 구현할 예정
// POST /api/profile - 프로필 생성/수정
// GET /api/profile/:userId - 프로필 조회

router.post('/', (req, res) => {
  res.json({ message: 'Profile route - to be implemented' });
});

router.get('/:userId', (req, res) => {
  res.json({ message: 'Get profile route - to be implemented' });
});

export default router;
