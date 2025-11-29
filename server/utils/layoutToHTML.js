/**
 * Layout JSON을 HTML로 변환하는 유틸리티 함수
 * @param {Object} template - 템플릿 객체
 * @param {Array} elements - 레이아웃 요소 배열
 * @returns {string} HTML 문자열
 */
export function layoutToHTML(template, elements) {
  const { layout, theme } = template;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: ${theme.fontFamily};
          background: ${theme.backgroundColor};
        }

        .resume-container {
          width: ${layout.width}px;
          height: ${layout.height}px;
          position: relative;
          background: white;
          margin: 0;
          padding: 0;
        }

        .element {
          position: absolute;
          overflow: hidden;
        }

        .element img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
  `;

  // 각 요소를 HTML로 변환
  elements.forEach(element => {
    const styleEntries = Object.entries(element.style || {});
    const styleStr = styleEntries
      .map(([key, value]) => {
        const cssKey = camelToKebab(key);
        // 숫자 값에 자동으로 px 추가 (특정 속성만)
        const needsPx = ['fontSize', 'padding', 'borderRadius', 'borderWidth'].includes(key);
        const cssValue = needsPx && typeof value === 'number' ? `${value}px` : value;
        return `${cssKey}: ${cssValue}`;
      })
      .join('; ');

    const positionStyle = `
      left: ${element.position.x}px;
      top: ${element.position.y}px;
      width: ${element.size.width}px;
      height: ${element.size.height}px;
    `;

    html += `
      <div class="element" style="${positionStyle} ${styleStr}">
    `;

    // 요소 타입별 컨텐츠 렌더링
    if (element.type === 'image') {
      const imgSrc = element.content || '/placeholder.png';
      html += `<img src="${imgSrc}" alt="" />`;
    } else if (element.type === 'text' || element.type === 'richtext') {
      html += element.content || '';
    } else if (element.type === 'section') {
      html += element.content || '';
    }

    html += `
      </div>
    `;
  });

  html += `
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * camelCase를 kebab-case로 변환
 * @param {string} str - camelCase 문자열
 * @returns {string} kebab-case 문자열
 */
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
