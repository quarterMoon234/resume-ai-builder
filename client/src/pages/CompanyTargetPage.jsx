// 타겟 기업 선택 페이지
// 나중에 기업명과 채용 페이지 URL을 입력하는 폼을 구현할 예정

function CompanyTargetPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">타겟 기업 선택</h2>
      <p className="text-gray-600">
        여기에서 지원하려는 기업 정보를 입력할 수 있습니다.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        (기업명, 채용 페이지 URL 등)
      </p>
    </div>
  );
}

export default CompanyTargetPage;
