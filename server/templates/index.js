/**
 * 템플릿 통합 관리 모듈
 * 모든 이력서 템플릿을 중앙에서 관리
 */
import { modernTemplate } from './modern.js';
import { classicTemplate } from './classic.js';
import { creativeTemplate } from './creative.js';
import { minimalTemplate } from './minimal.js';
import { corporateTemplate } from './corporate.js';

// 모든 템플릿 배열
export const allTemplates = [
  modernTemplate,
  classicTemplate,
  creativeTemplate,
  minimalTemplate,
  corporateTemplate
];

/**
 * 템플릿 ID로 템플릿 가져오기
 * @param {string} templateId - 템플릿 ID
 * @returns {Object|null} 템플릿 객체 또는 null
 */
export function getTemplateById(templateId) {
  return allTemplates.find(template => template.id === templateId) || null;
}

/**
 * 모든 템플릿 목록 가져오기
 * @returns {Array} 템플릿 배열
 */
export function getAllTemplates() {
  return allTemplates;
}

/**
 * 템플릿 메타데이터만 가져오기 (AI 추천용)
 * @returns {Array} 메타데이터 배열
 */
export function getTemplateMetadata() {
  return allTemplates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    suitableFor: template.suitableFor
  }));
}

/**
 * 산업/직무별 추천 템플릿 필터링
 * @param {string} industry - 산업/직무
 * @returns {Array} 추천 템플릿 배열
 */
export function getTemplatesByIndustry(industry) {
  return allTemplates.filter(template =>
    template.suitableFor.industries.some(ind =>
      ind.toLowerCase().includes(industry.toLowerCase())
    )
  );
}

/**
 * 경력 수준별 추천 템플릿 필터링
 * @param {string} careerLevel - 경력 수준 (신입/경력)
 * @returns {Array} 추천 템플릿 배열
 */
export function getTemplatesByCareerLevel(careerLevel) {
  return allTemplates.filter(template =>
    template.suitableFor.careerLevel.includes(careerLevel)
  );
}
