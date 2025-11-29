import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import ResumeResultPage from './pages/ResumeResultPage';
import ResumeHistoryPage from './pages/ResumeHistoryPage';
import ResumeEditorPage from './pages/ResumeEditorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 에디터는 레이아웃 없이 전체 화면 사용 */}
        <Route path="/editor/:resumeId" element={<ResumeEditorPage />} />

        {/* 나머지 페이지는 레이아웃 사용 */}
        <Route path="/" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/history" element={<Layout><ResumeHistoryPage /></Layout>} />
        <Route path="/result/:id" element={<Layout><ResumeResultPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
