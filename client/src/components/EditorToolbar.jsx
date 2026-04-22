const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function EditorToolbar({ selectedElement, onStyleChange, onContentChange, onSave, onDownloadPDF, zoom, setZoom }) {
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file || !selectedElement) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 첨부할 수 있습니다.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert('이미지는 2MB 이하 파일만 첨부할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onContentChange(selectedElement.id, reader.result);
    };
    reader.onerror = () => {
      alert('이미지를 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">이력서 에디터</h2>

      {/* 액션 버튼 */}
      <div className="mb-6 space-y-2">
        <button
          onClick={onSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          💾 저장하기
        </button>
        <button
          onClick={onDownloadPDF}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
        >
          📄 PDF 다운로드
        </button>
      </div>

      {/* 줌 컨트롤 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">줌 레벨</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-sm flex-1 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* 선택된 요소 없을 때 안내 */}
      {!selectedElement && (
        <div className="text-sm text-gray-500">
          <p>요소를 선택하면</p>
          <p>속성을 편집할 수 있습니다.</p>
        </div>
      )}

      {/* 선택된 요소 속성 편집 */}
      {selectedElement && (
        <div className="flex-1 overflow-auto">
          <h3 className="text-lg font-bold mb-4">속성 편집</h3>

          {/* 위치 조정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">위치 (X, Y)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={selectedElement.position.x}
                onChange={(e) => {
                  const newPosition = { ...selectedElement.position, x: parseInt(e.target.value) || 0 };
                  // onMove는 상위 컴포넌트에서 정의됨
                }}
                className="border rounded px-2 py-1 text-sm"
                placeholder="X"
                disabled
              />
              <input
                type="number"
                value={selectedElement.position.y}
                onChange={(e) => {
                  const newPosition = { ...selectedElement.position, y: parseInt(e.target.value) || 0 };
                }}
                className="border rounded px-2 py-1 text-sm"
                placeholder="Y"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">드래그로 이동하세요</p>
          </div>

          {/* 크기 조정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">크기 (W, H)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  value={selectedElement.size.width}
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="너비"
                  disabled
                />
              </div>
              <div>
                <input
                  type="number"
                  value={selectedElement.size.height}
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="높이"
                  disabled
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">리사이즈 핸들로 조정하세요</p>
          </div>

          {selectedElement.type === 'image' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">이미지</label>
              <div className="w-full h-32 bg-gray-100 border border-gray-300 rounded overflow-hidden mb-2 flex items-center justify-center">
                {selectedElement.content ? (
                  <img
                    src={selectedElement.content}
                    alt="선택된 이미지 미리보기"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">이미지 없음</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs text-gray-700 file:mb-2 file:w-full file:px-3 file:py-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedElement.content && (
                <button
                  type="button"
                  onClick={() => onContentChange(selectedElement.id, '')}
                  className="mt-2 w-full px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                >
                  이미지 삭제
                </button>
              )}
              <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP 등 2MB 이하 파일</p>
            </div>
          )}

          {/* 폰트 크기 */}
          {selectedElement.style?.fontSize && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">폰트 크기</label>
              <input
                type="number"
                value={selectedElement.style.fontSize}
                onChange={(e) => onStyleChange(selectedElement.id, 'fontSize', parseInt(e.target.value) || 12)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
          )}

          {/* 폰트 굵기 */}
          {selectedElement.style?.fontWeight !== undefined && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">폰트 굵기</label>
              <select
                value={selectedElement.style.fontWeight}
                onChange={(e) => onStyleChange(selectedElement.id, 'fontWeight', e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="normal">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi-Bold</option>
                <option value="bold">Bold</option>
                <option value="700">700</option>
              </select>
            </div>
          )}

          {/* 텍스트 색상 */}
          {selectedElement.style?.color && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">텍스트 색상</label>
              <input
                type="color"
                value={selectedElement.style.color}
                onChange={(e) => onStyleChange(selectedElement.id, 'color', e.target.value)}
                className="w-full h-10 border rounded cursor-pointer"
              />
            </div>
          )}

          {/* 배경 색상 */}
          {selectedElement.style?.backgroundColor && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">배경 색상</label>
              <input
                type="color"
                value={selectedElement.style.backgroundColor}
                onChange={(e) => onStyleChange(selectedElement.id, 'backgroundColor', e.target.value)}
                className="w-full h-10 border rounded cursor-pointer"
              />
            </div>
          )}

          {/* 테두리 반경 */}
          {selectedElement.style?.borderRadius !== undefined && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">테두리 반경</label>
              <input
                type="text"
                value={selectedElement.style.borderRadius}
                onChange={(e) => onStyleChange(selectedElement.id, 'borderRadius', e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="예: 8px, 50%"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EditorToolbar;
