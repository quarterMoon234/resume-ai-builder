import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

function DraggableElement({ element, isSelected, onMove, onResize, onContentChange, onSelect }) {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'ELEMENT',
    item: { id: element.id, position: element.position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onMove(element.id, {
          x: Math.round(item.position.x + delta.x),
          y: Math.round(item.position.y + delta.y)
        });
      }
    }
  });

  drag(ref);

  const handleDoubleClick = () => {
    if (element.type === 'text' || element.type === 'richtext' || element.type === 'section') {
      setIsEditing(true);
    }
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    const newContent = element.type === 'section' ? e.target.innerHTML : e.target.innerText;
    onContentChange(element.id, newContent);
  };

  // 스타일 객체 생성
  const styleObj = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    ...element.style,
    cursor: isDragging ? 'grabbing' : 'grab',
    border: isSelected ? '2px solid #2563eb' : '1px solid transparent',
    opacity: isDragging ? 0.5 : 1,
    boxSizing: 'border-box'
  };

  return (
    <div
      ref={ref}
      style={styleObj}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={handleDoubleClick}
    >
      {element.type === 'image' && (
        <img
          src={element.content || '/placeholder.png'}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />
      )}

      {element.type === 'text' && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {element.content}
        </div>
      )}

      {element.type === 'richtext' && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            outline: 'none',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {element.content}
        </div>
      )}

      {element.type === 'section' && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            outline: 'none',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={!isEditing ? { __html: element.content } : undefined}
        >
          {isEditing ? element.content : null}
        </div>
      )}

      {/* 리사이즈 핸들 (선택된 요소에만 표시) */}
      {isSelected && (
        <>
          <div
            style={{
              position: 'absolute',
              right: -5,
              bottom: -5,
              width: 10,
              height: 10,
              backgroundColor: '#2563eb',
              cursor: 'se-resize',
              borderRadius: '50%'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = element.size.width;
              const startHeight = element.size.height;

              const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;

                onResize(element.id, {
                  width: Math.max(50, startWidth + deltaX),
                  height: Math.max(20, startHeight + deltaY)
                });
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </>
      )}
    </div>
  );
}

export default DraggableElement;
