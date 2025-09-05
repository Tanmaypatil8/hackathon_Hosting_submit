import { useState, useEffect } from 'react';
import { getHackathons } from '../api';
import HackathonCard from '../components/HackathonCard';

export default function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    domain: '',
    status: '',
    mode: '',
    sortBy: 'popular'
  });

  useEffect(() => {
    getHackathons().then(data => setHackathons(data));
  }, []);

  const filteredHackathons = hackathons.filter(h => 
    h.title.toLowerCase().includes(filters.search.toLowerCase()) &&
    (!filters.location || h.location === filters.location) &&
    (!filters.domain || h.domain === filters.domain) &&
    (!filters.mode || h.mode === filters.mode)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="search"
            placeholder="Search hackathons..."
            className="w-full p-3 rounded-md border"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={filters.location}
              onChange={e => setFilters({...filters, location: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="">Location</option>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
            </select>
            
            <select
              value={filters.domain}
              onChange={e => setFilters({...filters, domain: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="">Domain</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="ai">AI/ML</option>
            </select>
            
            <select
              value={filters.mode}
              onChange={e => setFilters({...filters, mode: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="">Mode</option>
              <option value="team">Team</option>
              <option value="individual">Individual</option>
            </select>
            
            <select
              value={filters.sortBy}
              onChange={e => setFilters({...filters, sortBy: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="prize">Highest Prize</option>
            </select>
          </div>
        </div>

        {/* Hackathon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      </div>
    </div>
  );
}
