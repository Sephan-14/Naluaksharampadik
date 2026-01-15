import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser && !userProfile) {
    return <Navigate to="/complete-profile" />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userProfile } = useAuth();

  if (currentUser && userProfile) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
