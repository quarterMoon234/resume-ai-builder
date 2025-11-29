import express from 'express';
import { getAllTemplates, getTemplateById, getTemplateMetadata } from '../templates/index.js';

const router = express.Router();

/**
 * GET /api/template
 * 모든 템플릿 목록 조회
 */
router.get('/', (req, res) => {
  try {
    const templates = getAllTemplates();
    res.json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('템플릿 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '템플릿 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/template/metadata
 * 템플릿 메타데이터만 조회 (AI 추천용)
 */
router.get('/metadata', (req, res) => {
  try {
    const metadata = getTemplateMetadata();
    res.json({
      success: true,
      count: metadata.length,
      templates: metadata
    });
  } catch (error) {
    console.error('템플릿 메타데이터 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '템플릿 메타데이터 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * GET /api/template/:id
 * 특정 템플릿 조회
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const template = getTemplateById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: '템플릿을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('템플릿 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '템플릿 조회 중 오류가 발생했습니다.'
    });
  }
});

export default router;
