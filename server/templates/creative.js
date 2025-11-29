/**
 * Creative Template - 크리에이티브 스타일 이력서 템플릿
 * 디자이너/예술가/크리에이터 분야에 적합
 * 독창적이고 눈에 띄는 비대칭 레이아웃
 */
export const creativeTemplate = {
  id: 'creative',
  name: '크리에이티브 스타일',
  description: '독창적이고 눈에 띄는 디자인. 디자이너/예술가/크리에이터에 적합',

  suitableFor: {
    industries: ['디자인', '예술', '미디어', '광고', '크리에이터', '엔터테인먼트'],
    careerLevel: ['신입', '경력'],
    personality: ['창의적', '독창적', '예술적', '자유로운']
  },

  layout: {
    width: 794,
    height: 1123,

    elements: [
      // 왼쪽 사이드바 배경
      {
        id: 'sidebarBackground',
        type: 'section',
        position: { x: 0, y: 0 },
        size: { width: 280, height: 1123 },
        style: {
          backgroundColor: '#0f172a',
          color: '#ffffff'
        }
      },

      // 프로필 사진 (사이드바 상단)
      {
        id: 'profilePhoto',
        type: 'image',
        position: { x: 80, y: 60 },
        size: { width: 120, height: 120 },
        style: {
          borderRadius: '50%',
          border: '4px solid #f59e0b',
          objectFit: 'cover'
        }
      },

      // 이름 (사이드바)
      {
        id: 'name',
        type: 'text',
        position: { x: 30, y: 210 },
        size: { width: 220, height: 80 },
        style: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3
        }
      },

      // 연락처 (사이드바)
      {
        id: 'contact',
        type: 'text',
        position: { x: 30, y: 310 },
        size: { width: 220, height: 100 },
        style: {
          fontSize: 11,
          color: '#cbd5e1',
          lineHeight: 1.8,
          textAlign: 'center'
        }
      },

      // 스킬 섹션 (사이드바)
      {
        id: 'skillsSection',
        type: 'section',
        position: { x: 30, y: 440 },
        size: { width: 220, height: 250 },
        style: {
          fontSize: 11,
          lineHeight: 1.6,
          color: '#e2e8f0'
        }
      },

      // 학력 섹션 (사이드바)
      {
        id: 'educationSection',
        type: 'section',
        position: { x: 30, y: 720 },
        size: { width: 220, height: 180 },
        style: {
          fontSize: 11,
          lineHeight: 1.6,
          color: '#e2e8f0'
        }
      },

      // 자격증 (사이드바 하단)
      {
        id: 'certificationsSection',
        type: 'section',
        position: { x: 30, y: 930 },
        size: { width: 220, height: 150 },
        style: {
          fontSize: 10,
          lineHeight: 1.5,
          color: '#e2e8f0'
        }
      },

      // 메인 영역: 한 줄 소개
      {
        id: 'summary',
        type: 'richtext',
        position: { x: 310, y: 60 },
        size: { width: 444, height: 120 },
        style: {
          fontSize: 15,
          lineHeight: 1.8,
          color: '#1e293b',
          padding: 20,
          backgroundColor: '#fef3c7',
          borderLeft: '5px solid #f59e0b'
        }
      },

      // 메인 영역: 경력 섹션
      {
        id: 'experienceSection',
        type: 'section',
        position: { x: 310, y: 210 },
        size: { width: 444, height: 500 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      },

      // 메인 영역: 프로젝트 섹션
      {
        id: 'projectsSection',
        type: 'section',
        position: { x: 310, y: 730 },
        size: { width: 444, height: 350 },
        style: {
          fontSize: 13,
          lineHeight: 1.7,
          color: '#1e293b'
        }
      }
    ]
  },

  theme: {
    primaryColor: '#f59e0b',
    secondaryColor: '#0f172a',
    backgroundColor: '#ffffff',
    accentColor: '#fef3c7',
    fontFamily: 'Noto Sans KR, sans-serif'
  }
};
