// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewReportPage from './pages/NewReportPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import Navbar from './components/Navbar';
import AwarenessHubPage from './pages/AwarenessHubPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import HeatmapPage from './pages/HeatmapPage';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import MyReportsPage from './pages/MyReportPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import OAuth2Callback from './components/OAuth2Callback .jsx';
import Footer from './pages/Footer.jsx';
import GovernmentSchemaPage from './pages/GovernmentSchemaPage.jsx';
import GovernmentServicesPage from './pages/GovernmentServicesPage.jsx';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report/new" element={<NewReportPage />} />
            <Route path="/report/:id" element={<ReportDetailsPage />} />
            <Route path="/awareness" element={<AwarenessHubPage />} />
            <Route path="/awareness/:articleId" element={<ArticleDetailPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/myreport" element={<MyReportsPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
               <Route path="/myreport" element={<MyReportsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />
                <Route path="/schemes" element={<GovernmentSchemaPage />} />
                <Route path="/services" element={<GovernmentServicesPage />} />
          </Routes>
        </main>
        <Footer/>
      </Router>
    </NotificationProvider>
  );
}

export default App;