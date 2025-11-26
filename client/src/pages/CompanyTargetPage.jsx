import { useState } from 'react';
import axios from 'axios';

function CompanyTargetPage() {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    jobUrl: '',
    jobDescription: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [savedProfileId, setSavedProfileId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customResume, setCustomResume] = useState(null);

  // 기업 정보 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 기업 분석 요청
  const handleAnalyze = async () => {
    if (!companyData.companyName || !companyData.jobUrl) {
      alert('기업명과 채용 페이지 URL을 입력해주세요!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await axios.post('/api/company/analyze', companyData);
      setAnalysisResult(response.data.analysis);
      alert('기업 분석이 완료되었습니다!');
    } catch (error) {
      console.error('기업 분석 오류:', error);

      if (error.response) {
        alert(`기업 분석 실패: ${error.response.data.message || '서버 오류'}`);
      } else if (error.request) {
        alert('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 맞춤형 이력서 생성
  const handleGenerateCustomResume = async () => {
    if (!savedProfileId) {
      alert('프로필 ID를 입력해주세요!');
      return;
    }

    if (!analysisResult) {
      alert('먼저 기업 분석을 진행해주세요!');
      return;
    }

    setIsGenerating(true);
    setCustomResume(null);

    try {
      const response = await axios.post('/api/generate/custom', {
        profileId: savedProfileId,
        companyAnalysis: analysisResult,
        companyName: companyData.companyName
      });

      setCustomResume(response.data.resume);
      alert('맞춤형 이력서가 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('맞춤형 이력서 생성 오류:', error);

      if (error.response) {
        alert(`이력서 생성 실패: ${error.response.data.message || '서버 오류'}`);
      } else if (error.request) {
        alert('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">타겟 기업 맞춤형 이력서</h1>

      {/* 기업 정보 입력 섹션 */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">1. 타겟 기업 정보</h2>

        <div className="space-y-6">
          {/* 기업명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              기업명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={companyData.companyName}
              onChange={handleInputChange}
              placeholder="예: 카카오, 네이버, 삼성전자"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 채용 페이지 URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              채용 페이지 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="jobUrl"
              value={companyData.jobUrl}
              onChange={handleInputChange}
              placeholder="https://careers.example.com/jobs/123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              지원하려는 직무의 채용 공고 URL을 입력해주세요.
            </p>
          </div>

          {/* 직무 설명 (선택) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              직무 설명 (선택)
            </label>
            <textarea
              name="jobDescription"
              value={companyData.jobDescription}
              onChange={handleInputChange}
              placeholder="채용 공고의 주요 내용을 붙여넣거나 직접 입력해주세요..."
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 <strong>자동 크롤링:</strong> 이 필드를 비워두면 위의 URL에서 자동으로 채용 공고 내용을 추출합니다.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              💡 <strong>수동 입력:</strong> 크롤링이 실패하거나 특정 내용만 강조하고 싶다면 직접 입력하세요.
            </p>
          </div>

          {/* 기업 분석 버튼 */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isAnalyzing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnalyzing ? '분석 중...' : '기업 분석하기'}
          </button>
        </div>
      </div>

      {/* 기업 분석 결과 표시 */}
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">기업 분석 결과</h3>
            <button
              onClick={() => setAnalysisResult(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ 닫기
            </button>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-gray-50 p-4 rounded">
              {analysisResult}
            </pre>
          </div>
        </div>
      )}

      {/* 맞춤형 이력서 생성 섹션 */}
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">2. 맞춤형 이력서 생성</h2>

          <div className="space-y-6">
            {/* 프로필 ID 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                프로필 ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={savedProfileId}
                onChange={(e) => setSavedProfileId(e.target.value)}
                placeholder="프로필 페이지에서 저장한 프로필 ID를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                프로필 페이지에서 저장하면 받을 수 있는 ID입니다.
              </p>
            </div>

            {/* 맞춤형 이력서 생성 버튼 */}
            <button
              onClick={handleGenerateCustomResume}
              disabled={!savedProfileId || isGenerating}
              className={`w-full px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                !savedProfileId || isGenerating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isGenerating ? '이력서 생성 중...' : '맞춤형 이력서 생성'}
            </button>
          </div>
        </div>
      )}

      {/* 맞춤형 이력서 표시 */}
      {customResume && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {companyData.companyName} 맞춤형 이력서
            </h3>
            <button
              onClick={() => setCustomResume(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ 닫기
            </button>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {customResume}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyTargetPage;
