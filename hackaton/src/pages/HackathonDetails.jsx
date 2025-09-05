import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHackathonById } from '../api';

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const data = await getHackathonById(id);
        setHackathon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  const handleRegister = () => {
    navigate(`/hackathons/${id}/register`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!hackathon) return <div className="text-center py-8">Hackathon not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{hackathon.title}</h1>
        
        <div className="prose max-w-none mb-6">
          <p className="text-lg text-gray-600">{hackathon.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Details</h3>
            <ul className="space-y-2">
              <li><span className="font-medium">Start Date:</span> {new Date(hackathon.startDate).toLocaleDateString()}</li>
              <li><span className="font-medium">End Date:</span> {new Date(hackathon.endDate).toLocaleDateString()}</li>
              <li><span className="font-medium">Mode:</span> {hackathon.mode}</li>
              <li><span className="font-medium">Domain:</span> {hackathon.domain}</li>
              {hackathon.teamSize && (
                <li><span className="font-medium">Team Size:</span> {hackathon.teamSize}</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Host Information</h3>
            {hackathon.host && (
              <ul className="space-y-2">
                <li><span className="font-medium">Host:</span> {hackathon.host.name}</li>
                <li><span className="font-medium">Contact:</span> {hackathon.host.email}</li>
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
