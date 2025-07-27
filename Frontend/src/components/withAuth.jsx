import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

// Higher-Order Component for route protection
const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (!apiService.isAuthenticated()) {
            // No token found, redirect to authentication page (root)
            navigate('/', { replace: true });
            return;
          }

          // Verify token is still valid
          await apiService.getProfile();
        } catch (error) {
          console.error('Authentication check failed:', error);
          // Token is invalid, logout and redirect to authentication page (root)
          apiService.logout();
          navigate('/', { replace: true });
        }
      };

      checkAuth();
    }, [navigate]);

    // Only render component if authenticated
    if (!apiService.isAuthenticated()) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
