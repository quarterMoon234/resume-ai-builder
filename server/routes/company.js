import express from 'express';

const router = express.Router();

// 나중에 기업 페이지 분석 API를 구현할 예정
// POST /api/company/analyze - 기업 채용 페이지 분석

router.post('/analyze', (req, res) => {
  res.json({ message: 'Company page analysis - to be implemented' });
});

export default router;
