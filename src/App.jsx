import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/pages/Dashboard';
import LoanApplications from './components/pages/LoanApplications';
import ApplicationDetail from './components/pages/ApplicationDetail';
import LoanTypes from './components/pages/LoanTypes';
import Customers from './components/pages/Customers';
import CustomerDetail from './components/pages/CustomerDetail';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('adminToken');
  const isAuthenticated = !!token;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component for Login
const PublicRoute = ({ children }) => {
  const token = Cookies.get('adminToken');
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
                  <Route path="/loan-applications/:id" element={<ApplicationDetail />} />
                  <Route path="/loan-types" element={<LoanTypes />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
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
