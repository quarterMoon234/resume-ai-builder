import { Link } from 'react-router-dom';

// 공통 레이아웃 컴포넌트
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">AI 이력서 생성기</h1>
          <div className="mt-4 flex gap-4">
            <Link to="/" className="text-blue-600 hover:underline">
              프로필 입력
            </Link>
            <Link to="/company" className="text-blue-600 hover:underline">
              타겟 기업 선택
            </Link>
            <Link to="/result" className="text-blue-600 hover:underline">
              이력서 결과
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
