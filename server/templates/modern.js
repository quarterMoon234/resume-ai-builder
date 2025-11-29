/**
 * Modern Template - 모던 스타일 이력서 템플릿
 * IT/스타트업/디자인/마케팅 분야에 적합
 * 깔끔하고 현대적인 2단 레이아웃
 */
export const modernTemplate = {
  id: 'modern',
  name: '모던 스타일',
  description: '깔끔하고 현대적인 디자인. IT/스타트업 분야에 적합',

  // AI 추천을 위한 메타데이터
  suitableFor: {
    industries: ['IT', 'SW 개발', '디자인', '마케팅', '스타트업', '컨설팅'],
    careerLevel: ['신입', '경력'],
    personality: ['혁신적', '창의적', '현대적', '프로페셔널']
  },

  // A4 크기 기준 (210mm x 297mm = 794px x 1123px @96dpi)
  layout: {
    width: 794,
    height: 1123,

    elements: [
      // 프로필 사진 (왼쪽 상단, 원형)
      {
        id: 'profilePhoto',
        type: 'image',
        position: { x: 50, y: 50 },
        size: { width: 120, height: 120 },
        style: {
          borderRadius: '50%',
          border: '3px solid #2563eb',
          objectFit: 'cover'
        }
      },

      // 이름 (프로필 사진 오른쪽)
      {
        id: 'name',
        type: 'text',
        position: { x: 200, y: 70 },
        size: { width: 400, height: 40 },
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#1e293b',
          fontFamily: 'Noto Sans KR, sans-serif'
        }
      },

      // 연락처 정보
      {
        id: 'contact',
        type: 'text',
        position: { x: 200, y: 120 },
        size: { width: 400, height: 30 },
        style: {
          fontSize: 14,
          color: '#64748b',
          lineHeight: 1.6
        }
      },

      // 한 줄 소개 (헤더 아래)
      {
        id: 'summary',
        type: 'richtext',
        position: { x: 50, y: 200 },
        size: { width: 694, height: 100 },
        style: {
          fontSize: 14,
          lineHeight: 1.8,
          color: '#334155',
          padding: 20,
          backgroundColor: '#f8fafc',
          borderRadius: 8
        }
      },

      // 왼쪽 컬럼: 주요 경력/프로젝트 섹션
      {
        id: 'experienceSection',
        type: 'section',
        position: { x: 50, y: 330 },
        size: { width: 450, height: 750 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 오른쪽 컬럼: 스킬/학력/자격증 섹션
      {
        id: 'skillsSection',
        type: 'section',
        position: { x: 530, y: 330 },
        size: { width: 214, height: 300 },
        style: {
          backgroundColor: '#f1f5f9',
          padding: 20,
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.6,
          color: '#334155'
        }
      },

      // 학력 섹션 (오른쪽 하단)
      {
        id: 'educationSection',
        type: 'section',
        position: { x: 530, y: 650 },
        size: { width: 214, height: 200 },
        style: {
          backgroundColor: '#f1f5f9',
          padding: 20,
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.6,
          color: '#334155'
        }
      },

      // 자격증 섹션 (오른쪽 최하단)
      {
        id: 'certificationsSection',
        type: 'section',
        position: { x: 530, y: 870 },
        size: { width: 214, height: 200 },
        style: {
          backgroundColor: '#f1f5f9',
          padding: 20,
          borderRadius: 8,
          fontSize: 11,
          lineHeight: 1.5,
          color: '#334155'
        }
      }
    ]
  },

  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    accentColor: '#f1f5f9',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
};
