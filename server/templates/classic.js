/**
 * Classic Template - 클래식 스타일 이력서 템플릿
 * 전통적인 기업/공공기관/금융 분야에 적합
 * 보수적이고 신뢰감 있는 1단 레이아웃
 */
export const classicTemplate = {
  id: 'classic',
  name: '클래식 스타일',
  description: '전통적이고 보수적인 디자인. 대기업/공기업/금융 분야에 적합',

  suitableFor: {
    industries: ['금융', '제조', '공공기관', '대기업', '법률', '회계'],
    careerLevel: ['경력', '신입'],
    personality: ['전통적', '신뢰감', '보수적', '안정적']
  },

  layout: {
    width: 794,
    height: 1123,

    elements: [
      // 이름 (최상단 중앙)
      {
        id: 'name',
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 694, height: 50 },
        style: {
          fontSize: 36,
          fontWeight: 'bold',
          color: '#1e293b',
          textAlign: 'center',
          borderBottom: '3px solid #1e293b',
          paddingBottom: 15
        }
      },

      // 연락처 (이름 아래 중앙)
      {
        id: 'contact',
        type: 'text',
        position: { x: 50, y: 120 },
        size: { width: 694, height: 30 },
        style: {
          fontSize: 13,
          color: '#475569',
          textAlign: 'center',
          lineHeight: 1.6
        }
      },

      // 한 줄 소개
      {
        id: 'summary',
        type: 'richtext',
        position: { x: 50, y: 180 },
        size: { width: 694, height: 80 },
        style: {
          fontSize: 14,
          lineHeight: 1.8,
          color: '#334155',
          padding: 15,
          borderLeft: '4px solid #1e293b'
        }
      },

      // 경력 섹션
      {
        id: 'experienceSection',
        type: 'section',
        position: { x: 50, y: 290 },
        size: { width: 694, height: 300 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 학력 섹션
      {
        id: 'educationSection',
        type: 'section',
        position: { x: 50, y: 610 },
        size: { width: 694, height: 150 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 스킬 섹션
      {
        id: 'skillsSection',
        type: 'section',
        position: { x: 50, y: 780 },
        size: { width: 694, height: 120 },
        style: {
          fontSize: 13,
          lineHeight: 1.6,
          color: '#334155'
        }
      },

      // 자격증 섹션
      {
        id: 'certificationsSection',
        type: 'section',
        position: { x: 50, y: 920 },
        size: { width: 694, height: 150 },
        style: {
          fontSize: 12,
          lineHeight: 1.6,
          color: '#334155'
        }
      }
    ]
  },

  theme: {
    primaryColor: '#1e293b',
    secondaryColor: '#475569',
    backgroundColor: '#ffffff',
    accentColor: '#f1f5f9',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
};
