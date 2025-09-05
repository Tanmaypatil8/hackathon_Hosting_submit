import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHackathonById } from '../api';

export default function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getHackathonById(id).then(setHackathon);
  }, [id]);

  if (!hackathon) return <div>Loading...</div>;

  const tabs = {
    overview: (
      <div>
        <h3 className="text-xl font-bold mb-4">About</h3>
        <p>{hackathon.description}</p>
      </div>
    ),
    rules: (
      <div>
        <h3 className="text-xl font-bold mb-4">Rules & Eligibility</h3>
        <ul className="list-disc pl-5 space-y-2">
          {hackathon.rules?.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>
    ),
    timeline: (
      <div>
        <h3 className="text-xl font-bold mb-4">Timeline</h3>
        <div className="space-y-4">
          {hackathon.rounds?.map((round, i) => (
            <div key={i} className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-bold">Round {i + 1}</h4>
              <p>Start: {new Date(round.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(round.endDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    prizes: (
      <div>
        <h3 className="text-xl font-bold mb-4">Prizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackathon.prizes?.map((prize, i) => (
            <div key={i} className="text-center p-6 border rounded-lg">
              <h4 className="font-bold text-lg">{prize.position}</h4>
              <p className="text-2xl font-bold text-green-600">${prize.amount}</p>
              <p className="text-gray-600">{prize.perks}</p>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <img 
            src={hackathon.poster} 
            alt={hackathon.title} 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">{hackathon.title}</h1>
          <p className="text-blue-600 font-medium">{hackathon.host?.name}</p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-600">Mode:</span>
              <span className="ml-2">{hackathon.mode}</span>
            </div>
            <div>
              <span className="text-gray-600">Domain:</span>
              <span className="ml-2">{hackathon.domain}</span>
            </div>
            <div>
              <span className="text-gray-600">Prize Pool:</span>
              <span className="ml-2 text-green-600 font-bold">
                ${hackathon.prizePool}
              </span>
            </div>
            <div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md">
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex space-x-4 border-b mb-6">
          {Object.keys(tabs).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {tabs[activeTab]}
      </div>
    </div>
  );
}
