import { useState } from 'react';

function ConsultingPanel({ consultingReport, isVisible, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible) return null;

  return (
    <div className={`bg-gray-50 border-l border-gray-200 overflow-auto transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-96'}`}>
      {isCollapsed ? (
        // 접힌 상태
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full h-full flex items-center justify-center hover:bg-gray-100"
        >
          <span className="transform -rotate-90 text-sm font-semibold text-gray-600">
            컨설팅 리포트 열기 →
          </span>
        </button>
      ) : (
        // 펼쳐진 상태
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-50 pb-3 border-b">
            <h2 className="text-lg font-bold text-gray-800">
              📝 컨설팅 리포트
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                title="접기"
              >
                ←
              </button>
              <button
                onClick={onToggle}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                title="닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {consultingReport ? (
            <div className="prose prose-sm max-w-none">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                  {consultingReport}
                </pre>
              </div>

              {/* 복사 버튼 */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(consultingReport);
                  alert('컨설팅 리포트가 클립보드에 복사되었습니다!');
                }}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                📋 복사하기
              </button>

              {/* 안내 메시지 */}
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-xs text-blue-800">
                  💡 <strong>활용 팁:</strong> 왼쪽 에디터에서 이력서를 편집하면서 이 컨설팅 내용을 참고하세요.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <p className="mb-2">📄</p>
                <p className="text-sm">컨설팅 리포트가 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsultingPanel;
