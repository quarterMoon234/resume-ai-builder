import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DraggableElement from '../components/DraggableElement';
import EditorToolbar from '../components/EditorToolbar';

function ResumeEditorPage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [layout, setLayout] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0.8);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      const response = await axios.get(`/api/resume/${resumeId}`);
      const resume = response.data.resume;

      if (!resume.layout) {
        alert('이 이력서는 디자인 이력서가 아닙니다.');
        navigate('/history');
        return;
      }

      setLayout(resume.layout);
      setLoading(false);
    } catch (error) {
      console.error('이력서 로드 오류:', error);
      alert('이력서를 불러오는데 실패했습니다.');
      navigate('/history');
    }
  };

  const handleElementMove = (elementId, newPosition) => {
    setLayout(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId
          ? { ...el, position: newPosition }
          : el
      )
    }));
  };

  const handleElementResize = (elementId, newSize) => {
    setLayout(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId
          ? { ...el, size: newSize }
          : el
      )
    }));
  };

  const handleContentChange = (elementId, newContent) => {
    setLayout(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId
          ? { ...el, content: newContent }
          : el
      )
    }));
  };

  const handleStyleChange = (elementId, styleKey, value) => {
    setLayout(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId
          ? { ...el, style: { ...el.style, [styleKey]: value } }
          : el
      )
    }));

    // selectedElement도 업데이트
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => ({
        ...prev,
        style: { ...prev.style, [styleKey]: value }
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/api/resume/${resumeId}`, { layout });
      alert('저장되었습니다!');
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        '/api/pdf/generate',
        { layout },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성에 실패했습니다.');
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">레이아웃을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100">
        {/* 왼쪽: 툴바 */}
        <EditorToolbar
          selectedElement={selectedElement}
          onStyleChange={handleStyleChange}
          onSave={handleSave}
          onDownloadPDF={handleDownloadPDF}
          zoom={zoom}
          setZoom={setZoom}
        />

        {/* 중앙: 캔버스 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 헤더 */}
          <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">이력서 에디터</h1>
              <p className="text-sm text-gray-500">요소를 드래그하여 이동, 더블클릭으로 편집</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/history')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← 목록으로
              </button>
              {saving && <span className="text-sm text-gray-500 self-center">저장 중...</span>}
            </div>
          </div>

          {/* 캔버스 영역 */}
          <div className="flex-1 p-8 overflow-auto" onClick={handleCanvasClick}>
            <div className="flex items-start justify-center min-h-full">
              <div
                className="bg-white shadow-2xl"
                style={{
                  width: layout.template.layout.width,
                  height: layout.template.layout.height,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  position: 'relative',
                  margin: '0 auto'
                }}
              >
                {layout.elements.map(element => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onMove={handleElementMove}
                    onResize={handleElementResize}
                    onContentChange={handleContentChange}
                    onSelect={() => setSelectedElement(element)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default ResumeEditorPage;
