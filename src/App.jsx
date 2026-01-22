import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoanApplications from './components/LoanApplications';
import LoanTypes from './components/LoanTypes';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component for Login
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/loan-applications" element={<LoanApplications />} />
                  <Route path="/loan-types" element={<LoanTypes />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
