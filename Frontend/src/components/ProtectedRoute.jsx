import { Navigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!apiService.isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
