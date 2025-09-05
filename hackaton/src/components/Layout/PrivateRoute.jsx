import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children, requireHost }) {
  const { token, isHost } = useSelector(state => state.user);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireHost && !isHost) {
    return <Navigate to="/profile" />;
  }

  return children;
}
