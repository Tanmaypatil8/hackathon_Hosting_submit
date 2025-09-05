import { useState } from 'react';

export function HackathonCard({ hackathon }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Banner Image */}
        {hackathon.banner && (
          <div className="w-full h-48 bg-gray-200">
            <img
              src={`http://localhost:5000${hackathon.banner}`} // Use the banner field
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800">{hackathon.title}</h3>

          {/* Description */}
          <p className="text-gray-600 mt-2 line-clamp-3">{hackathon.description}</p>

          {/* Poster Image */}
          {hackathon.poster && (
            <div className="mt-4">
              <img
                src={`http://localhost:5000${hackathon.poster}`} // Use the poster field
                alt={`${hackathon.title} Poster`}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Details */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              <strong>Domain:</strong> {hackathon.domain}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Mode:</strong> {hackathon.mode}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Start Date:</strong> {new Date(hackathon.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>End Date:</strong> {new Date(hackathon.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            <button className="bg-red-400 text-white px-6 py-2 rounded-md hover:bg-red-500 transition-colors">
              Apply Now!
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className={`mt-4 ${showDetails ? 'block' : 'hidden'}`}>
        <div className="border-t pt-4 space-y-4">
          <div>
            <h4 className="font-semibold">Overview</h4>
            <p className="text-gray-600">{hackathon.overview}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Required Skills</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(hackathon.skillsRequired) && hackathon.skillsRequired.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Criteria</h4>
            <p className="text-gray-600">{hackathon.criteria}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
      >
        {showDetails ? 'Show Less' : 'Show More'}
      </button>
    </>
  );
}

