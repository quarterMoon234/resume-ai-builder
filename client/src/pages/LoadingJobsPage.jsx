import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function LoadingJobsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId, generationId } = location.state || {};

  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('템플릿 추천 중...');
  const [jobPostings, setJobPostings] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      navigate('/');
      return;
    }

    const activeGenerationId = generationId || `profile-${profileId}`;
    let isCancelled = false;
    const startTimer = window.setTimeout(() => {
      if (isCancelled) return;

      // 채용 공고 API 호출
      loadJobPostings();

      // AI 이력서 생성 프로세스
      generateResume(activeGenerationId);
    }, 0);

    return () => {
      isCancelled = true;
      window.clearTimeout(startTimer);
    };
  }, [profileId, generationId]);

  useEffect(() => {
    // 채용 공고가 로드되면 슬라이드 시작
    if (jobPostings.length > 0) {
      const jobInterval = setInterval(() => {
        setCurrentJobIndex(prev => (prev + 1) % jobPostings.length);
      }, 2500); // 2.5초마다 공고 변경

      return () => clearInterval(jobInterval);
    }
  }, [jobPostings]);

  const loadJobPostings = async () => {
    try {
      console.log('[LoadingPage] 채용 공고 로딩 시작 - 랜덤 채용 공고');
      setJobsLoading(true);

      // 랜덤 채용 공고 조회
      const response = await axios.get('/api/jobs');

      if (response.data.success && response.data.jobs.length > 0) {
        setJobPostings(response.data.jobs);
        console.log('[LoadingPage] 랜덤 채용 공고 로드 성공:', response.data.jobs.length, '개');
      } else {
        console.warn('[LoadingPage] 채용 공고가 없습니다.');
        // 빈 배열로 설정 (UI에서 처리)
        setJobPostings([]);
      }
    } catch (error) {
      console.error('[LoadingPage] 채용 공고 로드 오류:', error);
      // 오류 발생 시 빈 배열
      setJobPostings([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const generateResume = async (activeGenerationId) => {
    try {
      // 1단계: 템플릿 추천 (0-40%)
      setStatusMessage('🎨 AI가 최적의 템플릿을 추천하고 있습니다...');
      setProgress(10);

      const recommendResponse = await axios.post('/api/generate/recommend-template', {
        profileId
      });
      const { template } = recommendResponse.data;
      setProgress(40);

      // 2단계: 디자인 이력서 + 컨설팅 리포트 통합 생성 (40-100%)
      setStatusMessage('✨ AI가 이력서와 컨설팅 리포트를 작성하고 있습니다...');
      setProgress(50);

      const generateResponse = await axios.post('/api/generate/generate-with-template', {
        profileId,
        templateId: template.id,
        generationId: activeGenerationId
      });
      const { resumeId } = generateResponse.data;
      setProgress(100);

      // 완료 후 에디터로 이동
      setStatusMessage('✅ 완료! 에디터로 이동합니다...');
      setTimeout(() => {
        navigate(`/editor/${resumeId}`);
      }, 800);

    } catch (error) {
      console.error('이력서 생성 오류:', error);
      alert('이력서 생성 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  const currentJob = jobPostings[currentJobIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* 진행률 표시 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {statusMessage}
          </h2>

          {/* 프로그레스 바 */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-gray-600 text-sm font-semibold">{progress}% 완료</p>

          {/* 로딩 애니메이션 */}
          <div className="flex justify-center mt-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                ✨
              </div>
            </div>
          </div>

          {/* 진행 단계 표시 */}
          <div className="mt-8 flex justify-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${progress >= 40 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <span>{progress >= 40 ? '✓' : '1'}</span>
              <span>템플릿 추천</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${progress >= 100 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <span>{progress >= 100 ? '✓' : '2'}</span>
              <span>이력서 + 컨설팅 생성</span>
            </div>
          </div>
        </div>

        {/* 취업 공고 슬라이드 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              💼 실시간 채용 공고
            </h3>
            {jobPostings.length > 0 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {currentJobIndex + 1} / {jobPostings.length}
              </span>
            )}
          </div>

          {jobsLoading ? (
            // 로딩 중
            <div className="border-l-4 border-gray-300 pl-5 py-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-500 text-sm mt-4">채용 공고를 불러오는 중...</p>
            </div>
          ) : jobPostings.length === 0 ? (
            // 공고 없음
            <div className="border-l-4 border-yellow-400 pl-5 py-8 text-center">
              <span className="text-4xl">📋</span>
              <p className="text-gray-600 mt-3">현재 표시할 채용 공고가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">잠시 후 다시 시도해주세요.</p>
            </div>
          ) : (
            // 공고 표시
            <>
              <div className="border-l-4 border-indigo-500 pl-5 py-3 transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{currentJob.logo}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {currentJob.company}
                    </h4>
                    <p className="text-lg text-gray-700">{currentJob.position}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📍</span>
                    <span>{currentJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>💰</span>
                    <span className="font-semibold">{currentJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    {currentJob.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {currentJob.url && (
                  <a
                    href={currentJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg block text-center"
                  >
                    자세히 보기 →
                  </a>
                )}
              </div>

              {/* 인디케이터 */}
              <div className="flex justify-center gap-2 mt-5">
                {jobPostings.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentJobIndex
                        ? 'bg-indigo-600 w-8'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            잠시만 기다려주세요. AI가 당신만의 맞춤 이력서를 만들고 있습니다.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            평균 소요 시간: 30초 ~ 1분
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingJobsPage;
