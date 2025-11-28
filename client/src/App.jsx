import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import ResumeResultPage from './pages/ResumeResultPage';
import ResumeHistoryPage from './pages/ResumeHistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/history" element={<ResumeHistoryPage />} />
          <Route path="/result/:id" element={<ResumeResultPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
