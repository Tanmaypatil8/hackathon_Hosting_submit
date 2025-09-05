import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHostProfile, getHackathons } from '../api';

export default function HostDashboard() {
  const [profile, setProfile] = useState(null);
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    getHostProfile().then(setProfile);
    getHackathons().then(data => {
      setHackathons(data.filter(h => h.hostId === profile?.id));
    });
  }, [profile?.id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4">
            {/* Profile Picture Section */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {profile.hostProfile?.profilePicUrl ? (
                <img
                  src={`http://localhost:5000${profile.hostProfile.profilePicUrl}`}
                  alt={profile.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(`http://localhost:5000${profile.hostProfile.profilePicUrl}`, '_blank')}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=128&background=random`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.location}</p>
              <p className="text-gray-600">{profile.profession}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              to="/host/profile/edit"
              className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center"
            >
              Edit Profile
            </Link>
            <Link
              to="/add-hackathon"
              className="block bg-green-600 text-white px-4 py-2 rounded-md text-center"
            >
              Host New Hackathon
            </Link>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Achievements</h3>
            <ul className="list-disc pl-4 text-gray-600">
              {profile.achievements?.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Social Links</h3>
          <div className="flex space-x-4">
            {Object.entries(profile.socialLinks || {}).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hackathons List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">My Hackathons</h2>
        <div className="space-y-4">
          {hackathons.map(hackathon => (
            <div
              key={hackathon.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{hackathon.title}</h3>
                <p className="text-gray-600">
                  {new Date(hackathon.startDate).toLocaleDateString()} - 
                  {new Date(hackathon.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/hackathons/${hackathon.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(hackathon.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
