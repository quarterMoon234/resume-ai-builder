import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResumeResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이력서 데이터 상태
  const [resumeData, setResumeData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // URL에서 이력서 ID를 가져와서 API 호출
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/resume/${id}`);

        if (response.data.success) {
          const { resume } = response.data;
          setResumeData(resume.content);
          setProfileData(resume.profile);
        }
      } catch (err) {
        console.error('이력서 조회 오류:', err);
        setError('이력서를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  // 이력서 복사 기능
  const handleCopyResume = async () => {
    try {
      await navigator.clipboard.writeText(resumeData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('복사 실패:', error);
      alert('이력서 복사에 실패했습니다.');
    }
  };

  // 새 이력서 생성 (프로필 페이지로 이동)
  const handleNewResume = () => {
    navigate('/');
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">이력서를 불러오는 중...</p>
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

  // 데이터가 없는 경우
  if (!resumeData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">이력서를 찾을 수 없습니다.</p>
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">📄 AI 이력서 컨설팅 리포트</h1>
        <p className="text-green-100">
          AI가 분석한 이력서 컨설팅 리포트입니다.
        </p>
        {profileData && (
          <p className="text-sm text-green-100 mt-2">
            프로필: {profileData.basicInfo?.name || '이름 없음'} ({profileData.basicInfo?.email || '이메일 없음'})
          </p>
        )}
      </div>

      {/* 액션 버튼 섹션 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopyResume}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              copySuccess
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copySuccess ? '✓ 복사 완료!' : '📋 이력서 복사하기'}
          </button>

          <button
            onClick={handleNewResume}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            🔄 새 리포트 생성
          </button>
        </div>

        {copySuccess && (
          <p className="mt-3 text-green-600 text-sm font-medium">
            이력서가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기(Ctrl+V 또는 Cmd+V)하세요.
          </p>
        )}
      </div>

      {/* 이력서 내용 섹션 */}
      <div className="bg-white rounded-lg shadow">
        {/* 이력서 미리보기 헤더 */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">📝 이력서 내용</h2>
          <p className="text-sm text-gray-600 mt-1">
            아래 내용을 검토하고 필요에 따라 수정하여 사용하세요.
          </p>
        </div>

        {/* 이력서 본문 */}
        <div className="p-8">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {resumeData}
            </pre>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">사용 안내</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>생성된 컨설팅 리포트를 복사하여 워드, 구글 독스 등에 붙여넣어 사용하세요.</li>
                <li>AI가 생성한 내용이므로 반드시 검토하고 필요한 부분을 수정하세요.</li>
                <li>프로필 정보를 수정하고 싶다면 "새 리포트 생성" 버튼을 클릭하세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-600">리포트 글자 수</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {resumeData.length.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-sm text-gray-600">예상 읽기 시간</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {Math.ceil(resumeData.length / 500)} 분
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResumeResultPage;
