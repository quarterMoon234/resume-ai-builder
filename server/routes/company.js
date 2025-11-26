import express from 'express';
import OpenAI from 'openai';
import Company from '../models/Company.js';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

// 환경 변수 로드
dotenv.config();

const router = express.Router();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 웹 크롤링 함수
async function scrapeJobDescription(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10초 타임아웃
    });

    const $ = cheerio.load(response.data);

    // 불필요한 요소 제거
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // 본문 텍스트 추출 (다양한 선택자 시도)
    let content = '';

    // 일반적인 채용 공고 선택자들
    const selectors = [
      '.job-description',
      '.job-detail',
      '.position-description',
      '.recruitment-detail',
      'article',
      'main',
      '.content',
      '#content',
      '.detail',
      'body'
    ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }

    // 텍스트 정리
    content = content
      .replace(/\s+/g, ' ')  // 여러 공백을 하나로
      .replace(/\n+/g, '\n') // 여러 줄바꿈을 하나로
      .trim();

    // 너무 길면 앞부분만 (5000자 제한)
    if (content.length > 5000) {
      content = content.substring(0, 5000) + '...';
    }

    return content || null;

  } catch (error) {
    console.error('크롤링 오류:', error.message);
    return null;
  }
}

// POST /api/company/analyze - 기업 채용 페이지 분석
router.post('/analyze', async (req, res) => {
  try {
    const { companyName, jobUrl, jobDescription } = req.body;

    if (!companyName || !jobUrl) {
      return res.status(400).json({
        success: false,
        message: '기업명과 채용 페이지 URL이 필요합니다.'
      });
    }

    let finalJobDescription = jobDescription;

    // jobDescription이 없으면 URL에서 크롤링 시도
    if (!finalJobDescription || finalJobDescription.trim() === '') {
      console.log('채용 공고 크롤링 시도:', jobUrl);
      const scrapedContent = await scrapeJobDescription(jobUrl);

      if (scrapedContent) {
        finalJobDescription = scrapedContent;
        console.log('크롤링 성공, 추출된 내용 길이:', scrapedContent.length);
      } else {
        console.log('크롤링 실패 - URL에서 내용을 추출할 수 없습니다.');
      }
    }

    // 분석할 내용 준비
    let contentToAnalyze = `기업명: ${companyName}\n채용 페이지 URL: ${jobUrl}\n`;

    if (finalJobDescription && finalJobDescription.trim()) {
      contentToAnalyze += `\n채용 공고 내용:\n${finalJobDescription}`;
    } else {
      contentToAnalyze += `\n※ 채용 공고 내용을 가져올 수 없습니다. URL과 기업명만으로 분석을 진행합니다.`;
    }

    // OpenAI를 사용하여 기업 및 채용 공고 분석
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 기업 채용 분석 전문가입니다. 주어진 기업 정보와 채용 공고를 분석하여 다음 정보를 제공해주세요:

**분석 항목:**
1. 기업 특징 및 문화
2. 주요 요구 역량 및 기술
3. 우대 사항
4. 직무 설명 및 주요 업무
5. 지원자가 강조해야 할 포인트

**중요:**
- 제공된 정보만을 기반으로 분석하세요
- 없는 정보는 추측하지 마세요
- 구체적이고 실용적인 조언을 제공하세요
- 이력서 작성에 실제로 도움이 되는 인사이트를 제공하세요`
        },
        {
          role: "user",
          content: contentToAnalyze
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const analysis = completion.choices[0].message.content;

    // DB에 저장
    const company = new Company({
      companyName,
      jobUrl,
      jobDescription,
      analysis,
      analyzedAt: new Date()
    });

    await company.save();

    // 성공 응답
    res.json({
      success: true,
      message: '기업 분석이 완료되었습니다.',
      analysis: analysis,
      companyId: company._id
    });

  } catch (error) {
    console.error('기업 분석 오류:', error);

    res.status(500).json({
      success: false,
      message: '기업 분석 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// GET /api/company/:id - 기업 분석 조회 (선택)
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: '기업 정보를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      company: company
    });

  } catch (error) {
    console.error('기업 조회 오류:', error);

    res.status(500).json({
      success: false,
      message: '기업 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
