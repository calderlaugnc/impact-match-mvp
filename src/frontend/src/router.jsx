import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MatchRequestPage from './pages/MatchRequestPage';
import MatchResultsPage from './pages/MatchResultsPage';
import SEListPage from './pages/SEListPage';
import SEDetailPage from './pages/SEDetailPage';
import ReportsPage from './pages/ReportsPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  },
  {
    path: '/match',
    element: <ProtectedRoute><MatchRequestPage /></ProtectedRoute>
  },
  {
    path: '/match/results/:matchId',
    element: <ProtectedRoute><MatchResultsPage /></ProtectedRoute>
  },
  { path: '/social-enterprises', element: <SEListPage /> },
  { path: '/social-enterprise/:id', element: <SEDetailPage /> },
  {
    path: '/reports',
    element: <ProtectedRoute><ReportsPage /></ProtectedRoute>
  }
]);
