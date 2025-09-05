import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerForHackathon } from '../api';

export default function HackathonRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    instituteName: '',
    course: '',
    gender: '',
    phoneNumber: '',
    profession: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerForHackathon(id, form);
      if (response.error) {
        setError(response.error);
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Hackathon Registration</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Institute Name*</label>
          <input
            type="text"
            required
            value={form.instituteName}
            onChange={e => setForm({...form, instituteName: e.target.value})}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course*</label>
          <input
            type="text"
            required
            value={form.course}
            onChange={e => setForm({...form, course: e.target.value})}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender*</label>
          <select
            required
            value={form.gender}
            onChange={e => setForm({...form, gender: e.target.value})}
            className="w-full rounded-md border p-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number*</label>
          <input
            type="tel"
            required
            value={form.phoneNumber}
            onChange={e => setForm({...form, phoneNumber: e.target.value})}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Profession*</label>
          <input
            type="text"
            required
            value={form.profession}
            onChange={e => setForm({...form, profession: e.target.value})}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}