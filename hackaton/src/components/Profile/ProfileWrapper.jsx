import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/userSlice';
import { getMe } from '../../api';
import UserProfileView from './UserProfileView';
import HostProfileView from './HostProfileView';

export default function ProfileWrapper() {
  const { token } = useSelector(state => state.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const data = await getMe();
        setUserData(data);
        dispatch(setCredentials({ token, user: data }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, token]);

  if (!token) {
    return <div className="text-center py-8">Please log in to view your profile.</div>;
  }

  if (loading) {
    return <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center py-8">Unable to load profile data.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      {userData.role === 'HOST' ? (
        <HostProfileView 
          user={userData} 
          formatDateTime={formatDateTime}
          formatDate={formatDate}
        />
      ) : (
        <UserProfileView 
          user={userData} 
          formatDateTime={formatDateTime}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}