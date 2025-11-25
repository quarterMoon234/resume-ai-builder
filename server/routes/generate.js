import express from 'express';

const router = express.Router();

// 나중에 이력서 생성 API를 구현할 예정
// POST /api/generate/basic - 기본 이력서 생성
// POST /api/generate/custom - 기업 맞춤형 이력서 생성

router.post('/basic', (req, res) => {
  res.json({ message: 'Basic resume generation - to be implemented' });
});

router.post('/custom', (req, res) => {
  res.json({ message: 'Custom resume generation - to be implemented' });
});

export default router;
