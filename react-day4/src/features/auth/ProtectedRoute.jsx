import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute component: ensures user is authenticated before rendering children.
 * If not authenticated, redirects to /login preserving the requested location.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
