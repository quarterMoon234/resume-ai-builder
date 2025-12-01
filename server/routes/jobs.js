import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// 공공기관 채용 API 설정
const PUBLIC_API_URL = 'https://apis.data.go.kr/1051000/recruitment/list';
const SERVICE_KEY = process.env.PUBLIC_JOBS_SERVICE_KEY;

/**
 * GET /api/jobs
 * 공공기관 채용 정보 조회 (LoadingPage용)
 * 랜덤으로 10개 채용 공고 반환
 */
router.get('/', async (req, res) => {
  try {
    console.log('[Jobs API] 채용 정보 요청 시작');

    // 공공기관 채용 API 호출 (많은 데이터 요청 후 랜덤 선택)
    const apiParams = {
      serviceKey: SERVICE_KEY,
      pageNo: 1,
      numOfRows: 50, // 50개 요청 후 랜덤으로 10개 선택
      resultType: 'json'
    };

    const response = await axios.get(PUBLIC_API_URL, {
      params: apiParams,
      timeout: 10000
    });

    console.log('[Jobs API] API 응답 상태:', response.status);

    // API 응답 데이터 파싱
    const responseData = response.data;

    let items = [];

    // 공공기관 채용 API 응답 구조: result 배열
    if (responseData.result && Array.isArray(responseData.result)) {
      items = responseData.result;
    } else if (responseData.response?.body?.items) {
      items = responseData.response.body.items;
    } else if (Array.isArray(responseData)) {
      items = responseData;
    }

    console.log('[Jobs API] API에서 받은 채용 공고 수:', items.length);

    // 랜덤으로 10개 선택
    const randomJobs = shuffleArray(items).slice(0, 10);
    console.log('[Jobs API] 랜덤 선택된 채용 공고 수:', randomJobs.length);

    // LoadingJobsPage 형식으로 데이터 변환
    const jobs = randomJobs.map(item => ({
      company: item.instNm || '채용기관',
      position: item.recrutPbancTtl || '채용공고',
      location: item.workRgnNmLst || '전국',
      salary: formatSalary(item),
      tags: extractTags(item),
      logo: getOrgLogo(item.instNm),
      source: 'public',
      url: item.srcUrl || null
    }));

    res.json({
      success: true,
      jobs,
      totalCount: responseData.response?.body?.totalCount || items.length
    });

  } catch (error) {
    console.error('[Jobs API] 오류 발생:', error.message);

    // 에러 상세 로깅
    if (error.response) {
      console.error('[Jobs API] 응답 오류:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      error: 'API 호출 실패',
      message: error.message
    });
  }
});

/**
 * 급여 정보 포맷팅
 */
function formatSalary(item) {
  // API에서 제공하는 급여 정보 활용
  if (item.scrnprcdrMthd?.includes('급여')) {
    return item.scrnprcdrMthd;
  }
  if (item.enterCntn?.includes('원')) {
    return item.enterCntn;
  }
  return '회사내규에 따름';
}

/**
 * 직무 태그 추출
 */
function extractTags(item) {
  const tags = [];
  const title = item.recrutPbancTtl || '';
  const ncs = item.ncsCdNmLst || '';
  const combined = `${title} ${ncs}`.toLowerCase();

  // IT 관련 키워드
  const itKeywords = {
    '정보': '정보시스템',
    '개발': '개발',
    '프로그래밍': '프로그래밍',
    'it': 'IT',
    '시스템': '시스템',
    '데이터': '데이터',
    '보안': '보안',
    '네트워크': '네트워크',
    '소프트웨어': 'SW',
    '웹': '웹'
  };

  // 일반 키워드
  const generalKeywords = {
    '행정': '행정',
    '기술': '기술',
    '사무': '사무',
    '연구': '연구',
    '관리': '관리'
  };

  // IT 키워드 우선 검색
  Object.entries(itKeywords).forEach(([key, value]) => {
    if (combined.includes(key) && tags.length < 3) {
      tags.push(value);
    }
  });

  // IT 태그가 없으면 일반 키워드 검색
  if (tags.length === 0) {
    Object.entries(generalKeywords).forEach(([key, value]) => {
      if (combined.includes(key) && tags.length < 3) {
        tags.push(value);
      }
    });
  }

  // 태그가 없으면 기본값
  if (tags.length === 0) {
    tags.push('채용');
  }

  return tags;
}

/**
 * 기관별 로고 이모지 반환
 */
function getOrgLogo(orgName) {
  if (!orgName) return '🏛️';

  const name = orgName.toLowerCase();

  // 기관 유형별 아이콘
  if (name.includes('대학') || name.includes('학교')) return '🎓';
  if (name.includes('병원') || name.includes('의료')) return '🏥';
  if (name.includes('연구') || name.includes('과학')) return '🔬';
  if (name.includes('문화') || name.includes('예술')) return '🎨';
  if (name.includes('체육') || name.includes('스포츠')) return '⚽';
  if (name.includes('교통') || name.includes('철도')) return '🚇';
  if (name.includes('환경') || name.includes('에너지')) return '🌱';
  if (name.includes('금융') || name.includes('은행')) return '🏦';
  if (name.includes('통신') || name.includes('정보')) return '📡';
  if (name.includes('건설') || name.includes('주택')) return '🏗️';

  // 기본 공공기관 아이콘
  return '🏛️';
}

/**
 * 배열 셔플 (Fisher-Yates 알고리즘)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default router;
