import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// 라우트 가져오기
import profileRoutes from './routes/profile.js';
import generateRoutes from './routes/generate.js';
import resumeRoutes from './routes/resume.js';

// 환경 변수 로드
dotenv.config();

// MongoDB 연결
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// Health check 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 라우트 연결
app.use('/api/profile', profileRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/resume', resumeRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
