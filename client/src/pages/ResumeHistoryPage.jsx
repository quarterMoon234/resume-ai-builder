import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResumeHistoryPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resume');

      if (response.data.success) {
        setResumes(response.data.resumes);
      }
    } catch (err) {
      console.error('이력서 목록 조회 오류:', err);
      setError('이력서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeClick = (resumeId) => {
    navigate(`/result/${resumeId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">이력서 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          프로필 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 이력서 히스토리</h1>
        <p className="text-purple-100">
          생성된 이력서 목록을 확인하고 다시 열람할 수 있습니다.
        </p>
      </div>

      {/* 이력서 목록이 없는 경우 */}
      {resumes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            생성된 이력서가 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            프로필을 입력하고 AI 이력서를 생성해보세요!
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              기본 이력서 생성
            </button>
            <button
              onClick={() => navigate('/company')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
            >
              맞춤형 이력서 생성
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 통계 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-600">총 이력서 수</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {resumes.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-600">기본 이력서</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {resumes.filter(r => r.type === 'basic').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-sm text-gray-600">맞춤형 이력서</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {resumes.filter(r => r.type === 'custom').length}
              </p>
            </div>
          </div>

          {/* 이력서 목록 */}
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => handleResumeClick(resume._id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* 이력서 타입 배지 */}
                    <div className="flex items-center gap-2 mb-2">
                      {resume.type === 'custom' ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                          🎯 맞춤형
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          📄 기본
                        </span>
                      )}
                      {resume.companyName && (
                        <span className="text-sm text-gray-600">
                          → {resume.companyName}
                        </span>
                      )}
                    </div>

                    {/* 프로필 정보 */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {resume.profileId?.basicInfo?.name || '이름 없음'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {resume.profileId?.basicInfo?.email || '이메일 없음'}
                    </p>

                    {/* 생성 일시 */}
                    <p className="text-xs text-gray-500">
                      생성일: {formatDate(resume.createdAt)}
                    </p>
                  </div>

                  {/* 화살표 아이콘 */}
                  <div className="text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ResumeHistoryPage;
