import express from 'express';
import puppeteer from 'puppeteer';
import { layoutToHTML } from '../utils/layoutToHTML.js';

const router = express.Router();

/**
 * POST /api/pdf/generate
 * 편집된 레이아웃을 PDF로 변환
 */
router.post('/generate', async (req, res) => {
  try {
    const { layout } = req.body;

    if (!layout || !layout.template || !layout.elements) {
      return res.status(400).json({
        success: false,
        message: '레이아웃 데이터가 올바르지 않습니다.'
      });
    }

    // Layout을 HTML로 변환
    const html = layoutToHTML(layout.template, layout.elements);

    // Puppeteer로 PDF 생성
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // A4 크기에 맞게 viewport 설정
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2 // 고해상도
    });

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      preferCSSPageSize: false
    });

    await browser.close();

    // PDF 응답
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdf);

  } catch (error) {
    console.error('PDF 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: 'PDF 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

/**
 * POST /api/pdf/preview
 * HTML 미리보기 생성 (디버깅용)
 */
router.post('/preview', async (req, res) => {
  try {
    const { layout } = req.body;

    if (!layout || !layout.template || !layout.elements) {
      return res.status(400).json({
        success: false,
        message: '레이아웃 데이터가 올바르지 않습니다.'
      });
    }

    const html = layoutToHTML(layout.template, layout.elements);

    res.contentType('text/html');
    res.send(html);

  } catch (error) {
    console.error('HTML 미리보기 생성 오류:', error);
    res.status(500).json({
      success: false,
      message: 'HTML 미리보기 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

export default router;
