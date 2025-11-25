import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import ProfilePage from './pages/ProfilePage';
import CompanyTargetPage from './pages/CompanyTargetPage';
import ResumeResultPage from './pages/ResumeResultPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/company" element={<CompanyTargetPage />} />
          <Route path="/result" element={<ResumeResultPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
