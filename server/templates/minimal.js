/**
 * Minimal Template - 미니멀 스타일 이력서 템플릿
 * 개발자/엔지니어/연구원 분야에 적합
 * 군더더기 없는 심플하고 깔끔한 레이아웃
 */
export const minimalTemplate = {
  id: 'minimal',
  name: '미니멀 스타일',
  description: '군더더기 없는 심플한 디자인. 개발자/엔지니어/연구원에 적합',

  suitableFor: {
    industries: ['SW 개발', '엔지니어링', '연구', '데이터', '기술', 'IT'],
    careerLevel: ['경력', '신입'],
    personality: ['논리적', '체계적', '미니멀', '효율적']
  },

  layout: {
    width: 794,
    height: 1123,

    elements: [
      // 이름 (좌측 정렬, 심플)
      {
        id: 'name',
        type: 'text',
        position: { x: 60, y: 60 },
        size: { width: 674, height: 45 },
        style: {
          fontSize: 38,
          fontWeight: '700',
          color: '#000000',
          letterSpacing: '-0.5px'
        }
      },

      // 연락처 (이름 바로 아래)
      {
        id: 'contact',
        type: 'text',
        position: { x: 60, y: 115 },
        size: { width: 674, height: 25 },
        style: {
          fontSize: 12,
          color: '#666666',
          lineHeight: 1.5
        }
      },

      // 수평선
      {
        id: 'divider1',
        type: 'section',
        position: { x: 60, y: 155 },
        size: { width: 674, height: 1 },
        style: {
          backgroundColor: '#000000'
        }
      },

      // 한 줄 소개
      {
        id: 'summary',
        type: 'richtext',
        position: { x: 60, y: 180 },
        size: { width: 674, height: 70 },
        style: {
          fontSize: 14,
          lineHeight: 1.7,
          color: '#333333'
        }
      },

      // 경력 섹션
      {
        id: 'experienceSection',
        type: 'section',
        position: { x: 60, y: 280 },
        size: { width: 674, height: 340 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1a1a1a'
        }
      },

      // 프로젝트 섹션
      {
        id: 'projectsSection',
        type: 'section',
        position: { x: 60, y: 640 },
        size: { width: 674, height: 200 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1a1a1a'
        }
      },

      // 스킬 섹션
      {
        id: 'skillsSection',
        type: 'section',
        position: { x: 60, y: 860 },
        size: { width: 330, height: 100 },
        style: {
          fontSize: 12,
          lineHeight: 1.6,
          color: '#333333'
        }
      },

      // 학력 섹션
      {
        id: 'educationSection',
        type: 'section',
        position: { x: 404, y: 860 },
        size: { width: 330, height: 100 },
        style: {
          fontSize: 12,
          lineHeight: 1.6,
          color: '#333333'
        }
      },

      // 자격증 섹션
      {
        id: 'certificationsSection',
        type: 'section',
        position: { x: 60, y: 980 },
        size: { width: 674, height: 100 },
        style: {
          fontSize: 11,
          lineHeight: 1.5,
          color: '#333333'
        }
      }
    ]
  },

  theme: {
    primaryColor: '#000000',
    secondaryColor: '#666666',
    backgroundColor: '#ffffff',
    accentColor: '#f5f5f5',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
};
