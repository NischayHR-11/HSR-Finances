import { Navigate, useLocation } from 'react-router-dom';
import apiService from '../services/apiService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!apiService.isAuthenticated()) {
    // Redirect to root (authentication) page with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
