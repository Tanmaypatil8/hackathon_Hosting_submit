import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children, requireHost = false }) {
  const user = useSelector(state => state.user);

  // If not logged in, redirect to login
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  // If host access is required but user is not a host
  if (requireHost && user.role !== 'HOST') {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
