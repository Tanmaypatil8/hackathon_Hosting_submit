import { useEffect, useState } from "react";
import { getHackathons } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { fetchHackathons, registerHackathon } from "../slices/hackathonSlice";
import HackathonCard from "../components/HackathonCard";

export default function Hackathons() {
  const dispatch = useDispatch();
  const { hackathons, loading, error, registrationMessage } = useSelector((state) => state.hackathon);
  const token = useSelector(state => state.user.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [filteredHackathons, setFilteredHackathons] = useState(hackathons);

  useEffect(() => {
    dispatch(fetchHackathons());
  }, [dispatch]);

  useEffect(() => {
    setFilteredHackathons(
      hackathons.filter(hackathon => {
        const matchesSearch = !searchTerm || 
          (hackathon?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           hackathon?.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesDomain = selectedDomain === 'all' || 
          hackathon?.domain === selectedDomain;

        return matchesSearch && matchesDomain;
      })
    );
  }, [searchTerm, selectedDomain, hackathons]);

  const handleRegister = (id) => {
    if (!token) {
      alert("You must be logged in to register for a hackathon.");
      return;
    }
    dispatch(registerHackathon(id));
  };

  // Ensure hackathons is always an array
  const hackathonList = Array.isArray(hackathons) ? hackathons : [];

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!hackathonList.length) return <div className="text-center py-10">No hackathons found</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">View Every Hackathons We Have Here...</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search hackathons..."
          className="w-full p-3 rounded-lg bg-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Domain Filter */}
      <div className="mb-6">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100"
        >
          <option value="all">All Domains</option>
          <option value="web">Web Development</option>
          <option value="mobile">Mobile Development</option>
          <option value="ai">AI/ML</option>
          <option value="blockchain">Blockchain</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Filters */}
        <div className="w-64 space-y-4">
          <h2 className="font-semibold">Filters / Sorts:</h2>
          <ul className="space-y-2">
            <li>Location</li>
            <li>Domain</li>
            <li>Status</li>
            <li>Public/Online</li>
            <li>Date</li>
            <li>Most Popular</li>
            <li>Prizes</li>
            <li>Paid/Free</li>
            <li>Recently Added</li>
            <li>Submission Dates</li>
          </ul>
        </div>

        {/* Hackathon List */}
        <div className="flex-1 space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            filteredHackathons.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}