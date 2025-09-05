import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile, getHackathons } from '../api';

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [registeredHackathons, setRegisteredHackathons] = useState([]);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4">
            <img
              src={profile.profilePic || 'https://via.placeholder.com/100'}
              alt={profile.name}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">DOB: {new Date(profile.dob).toLocaleDateString()}</p>
              <p className="text-gray-600">{profile.location}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Link
              to="/user/profile/edit"
              className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center"
            >
              Edit Profile
            </Link>
            <Link
              to="/hackathons"
              className="block bg-green-600 text-white px-4 py-2 rounded-md text-center"
            >
              Join New Hackathon
            </Link>
          </div>
        </div>

        {/* Bio & Achievements */}
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

      {/* Hackathons & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registered Hackathons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Hackathons</h2>
          <div className="space-y-4">
            {profile.registrations?.map(registration => (
              <div key={registration.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{registration.hackathon.title}</h3>
                <p className="text-gray-600">
                  Status: {registration.status}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(registration.hackathon.startDate).toLocaleDateString()} - 
                  {new Date(registration.hackathon.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Certifications</h2>
          <div className="space-y-4">
            {profile.certifications?.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{cert.title}</h3>
                <p className="text-gray-600">{cert.hackathon}</p>
                <p className="text-sm text-gray-500">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
