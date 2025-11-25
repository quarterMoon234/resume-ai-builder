// 이력서 결과 페이지
// 나중에 생성된 이력서를 섹션별로 표시하고, PDF 다운로드나 복사 기능을 추가할 예정

function ResumeResultPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">생성된 이력서</h2>
      <p className="text-gray-600">
        여기에서 AI가 생성한 이력서 결과를 확인할 수 있습니다.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        (기본 이력서 또는 기업 맞춤형 이력서)
      </p>
    </div>
  );
}

export default ResumeResultPage;
