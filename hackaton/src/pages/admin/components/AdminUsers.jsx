import { useState, useEffect } from 'react';
import { getUsers, updateUserStatus } from '../../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleStatusUpdate = async (userId, status) => {
    const result = await updateUserStatus(userId, status);
    if (!result.error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b">Name</th>
            <th className="px-6 py-3 border-b">Email</th>
            <th className="px-6 py-3 border-b">Role</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">{user.status}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => handleStatusUpdate(user.id, 'BANNED')}
                  className="text-red-600 hover:text-red-800"
                >
                  Ban
                </button>
                <button
                  onClick={() => handleStatusUpdate(user.id, 'ACTIVE')}
                  className="text-green-600 hover:text-green-800"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(user.id, 'DELETED')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
