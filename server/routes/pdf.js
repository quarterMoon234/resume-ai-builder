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

    console.log('[PDF] 생성 시작 - 템플릿:', layout.template.name);
    console.log('[PDF] 요소 개수:', layout.elements.length);

    // Layout을 HTML로 변환
    const html = layoutToHTML(layout.template, layout.elements);
    console.log('[PDF] HTML 생성 완료 - 길이:', html.length);

    // Puppeteer로 PDF 생성
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // 메모리 부족 방지
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    console.log('[PDF] Puppeteer 브라우저 실행 완료');

    const page = await browser.newPage();

    // A4 크기에 맞게 viewport 설정
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2 // 고해상도
    });
    console.log('[PDF] Viewport 설정 완료');

    // HTML 컨텐츠 설정
    await page.setContent(html, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('[PDF] HTML 컨텐츠 로드 완료');

    // 폰트 로딩 대기 (Google Fonts 로딩 보장)
    await page.evaluateHandle('document.fonts.ready');
    console.log('[PDF] 폰트 로딩 완료');

    // 추가 안정화 시간 (렌더링 완료 보장)
    await new Promise(resolve => setTimeout(resolve, 1000)); // 500ms → 1000ms
    console.log('[PDF] 렌더링 안정화 대기 완료');

    // PDF 생성
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      preferCSSPageSize: false,
      timeout: 30000
    });
    console.log('[PDF] PDF 생성 완료 - 크기:', pdf.length, 'bytes');

    await browser.close();
    console.log('[PDF] 브라우저 종료 완료');

    // puppeteer가 Uint8Array를 반환하는 경우를 대비해 Buffer로 변환
    const pdfBuffer = Buffer.from(pdf);

    // PDF 응답
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
    console.log('[PDF] PDF 전송 완료');

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
