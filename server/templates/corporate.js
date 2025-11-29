/**
 * Corporate Template - 기업형 이력서 템플릿
 * 대기업/외국계/컨설팅 분야에 적합
 * 프로페셔널하고 세련된 레이아웃
 */
export const corporateTemplate = {
  id: 'corporate',
  name: '기업형 스타일',
  description: '프로페셔널하고 세련된 디자인. 대기업/외국계/컨설팅에 적합',

  suitableFor: {
    industries: ['대기업', '외국계', '컨설팅', '경영', '전략', '금융'],
    careerLevel: ['경력'],
    personality: ['프로페셔널', '세련된', '엘리트', '글로벌']
  },

  layout: {
    width: 794,
    height: 1123,

    elements: [
      // 상단 헤더 배경
      {
        id: 'headerBackground',
        type: 'section',
        position: { x: 0, y: 0 },
        size: { width: 794, height: 180 },
        style: {
          backgroundColor: '#1e40af',
          color: '#ffffff'
        }
      },

      // 프로필 사진 (헤더 내 좌측)
      {
        id: 'profilePhoto',
        type: 'image',
        position: { x: 60, y: 40 },
        size: { width: 100, height: 100 },
        style: {
          borderRadius: '8px',
          border: '3px solid #ffffff',
          objectFit: 'cover'
        }
      },

      // 이름 (헤더 내)
      {
        id: 'name',
        type: 'text',
        position: { x: 180, y: 50 },
        size: { width: 554, height: 45 },
        style: {
          fontSize: 34,
          fontWeight: 'bold',
          color: '#ffffff'
        }
      },

      // 연락처 (헤더 내)
      {
        id: 'contact',
        type: 'text',
        position: { x: 180, y: 105 },
        size: { width: 554, height: 25 },
        style: {
          fontSize: 13,
          color: '#dbeafe',
          lineHeight: 1.5
        }
      },

      // 한 줄 소개 (헤더 아래)
      {
        id: 'summary',
        type: 'richtext',
        position: { x: 60, y: 220 },
        size: { width: 674, height: 90 },
        style: {
          fontSize: 14,
          lineHeight: 1.8,
          color: '#1e293b',
          padding: 20,
          backgroundColor: '#eff6ff',
          borderLeft: '4px solid #1e40af'
        }
      },

      // 경력 섹션 (좌측)
      {
        id: 'experienceSection',
        type: 'section',
        position: { x: 60, y: 350 },
        size: { width: 430, height: 400 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 프로젝트 섹션 (좌측 하단)
      {
        id: 'projectsSection',
        type: 'section',
        position: { x: 60, y: 770 },
        size: { width: 430, height: 300 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 스킬 섹션 (우측 상단)
      {
        id: 'skillsSection',
        type: 'section',
        position: { x: 510, y: 350 },
        size: { width: 224, height: 200 },
        style: {
          fontSize: 12,
          lineHeight: 1.6,
          color: '#334155',
          padding: 15,
          backgroundColor: '#f8fafc',
          borderRadius: 8
        }
      },

      // 학력 섹션 (우측 중단)
      {
        id: 'educationSection',
        type: 'section',
        position: { x: 510, y: 570 },
        size: { width: 224, height: 180 },
        style: {
          fontSize: 12,
          lineHeight: 1.6,
          color: '#334155',
          padding: 15,
          backgroundColor: '#f8fafc',
          borderRadius: 8
        }
      },

      // 자격증 섹션 (우측 하단)
      {
        id: 'certificationsSection',
        type: 'section',
        position: { x: 510, y: 770 },
        size: { width: 224, height: 150 },
        style: {
          fontSize: 11,
          lineHeight: 1.5,
          color: '#334155',
          padding: 15,
          backgroundColor: '#f8fafc',
          borderRadius: 8
        }
      }
    ]
  },

  theme: {
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    accentColor: '#eff6ff',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
};
