import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddHackathon() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rules: [""],
    criteria: "",
    timeline: [{ phase: "Registration", date: "", description: "" }],
    rounds: [{ name: "", description: "" }],
    prizes: [{ type: "", amount: "", details: "" }],
    faqs: [{ question: "", answer: "" }],
    updates: [""],
    helpContact: "",
    mode: "ONLINE",
    teamSize: "",
    domain: "",
    skillsRequired: [""],
    startDate: "",
    endDate: "",
    location: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.user.token);
  const navigate = useNavigate();

  // Common styling for inputs and textareas
  const inputClasses = "mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 shadow-sm";
  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, index, value) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (name, defaultValue) => {
    setForm(prev => ({
      ...prev,
      [name]: [...prev[name], defaultValue]
    }));
  };

  const removeArrayItem = (name, index) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (data) => {
    if (!data.title || !data.description || !data.overview || !data.domain) {
      setMessage("Please fill in all required fields");
      return false;
    }
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      setMessage("End date must be after start date");
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        rules: Array.isArray(form.rules) ? form.rules.filter(Boolean) : [],
        skillsRequired: Array.isArray(form.skillsRequired) ? form.skillsRequired.filter(Boolean) : [],
        teamSize: form.teamSize ? parseInt(form.teamSize) : null,
        helpContact: [form.helpContact].filter(Boolean), // Convert to array
        // Remove fields that aren't in the schema
        overview: undefined,
        gallery: undefined,
        participantCount: undefined
      };

      const res = await fetch("http://localhost:5000/api/hackathons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Hackathon created successfully!");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setMessage(data.error || data.message || "Failed to create hackathon");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Create New Hackathon</h2>
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Basic Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter hackathon title"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain *</label>
              <input
                type="text"
                name="domain"
                value={form.domain}
                onChange={handleChange}
                placeholder="e.g., AI, Web Development"
                className={inputClasses}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the hackathon"
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Overview *</label>
            <textarea
              name="overview"
              value={form.overview}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed overview of the hackathon"
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter hackathon location (optional for online events)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1"
            />
          </div>
        </section>

        {/* Dates */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date *</label>
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Requirements</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Team Size</label>
            <input
              type="number"
              name="teamSize"
              value={form.teamSize}
              onChange={handleChange}
              placeholder="Enter maximum team size"
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Required Skills</label>
            {form.skillsRequired.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={e => handleArrayChange("skillsRequired", index, e.target.value)}
                  placeholder="Enter required skill"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("skillsRequired", index)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("skillsRequired", "")}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Skill
            </button>
          </div>
        </section>

        {/* Rules */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Rules</h3>
          {form.rules.map((rule, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={rule}
                onChange={e => handleArrayChange("rules", index, e.target.value)}
                placeholder={`Rule ${index + 1}`}
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("rules", index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("rules", "")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Rule
          </button>
        </section>

        {/* Judging Criteria */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Judging Criteria</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Criteria</label>
            <textarea
              name="criteria"
              value={form.criteria}
              onChange={handleChange}
              rows="4"
              placeholder="Enter judging criteria"
              className={inputClasses}
              required
            />
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Timeline</h3>
          {form.timeline.map((phase, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <input
                type="text"
                value={phase.phase}
                onChange={e => handleArrayChange("timeline", index, { ...phase, phase: e.target.value })}
                placeholder="Phase"
                className={inputClasses}
              />
              <input
                type="date"
                value={phase.date}
                onChange={e => handleArrayChange("timeline", index, { ...phase, date: e.target.value })}
                className={inputClasses}
              />
              <input
                type="text"
                value={phase.description}
                onChange={e => handleArrayChange("timeline", index, { ...phase, description: e.target.value })}
                placeholder="Description"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("timeline", index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("timeline", { phase: "", date: "", description: "" })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Timeline Phase
          </button>
        </section>

        {/* Rounds */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Rounds</h3>
          {form.rounds.map((round, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Round Name</label>
                <input
                  type="text"
                  value={round.name}
                  onChange={e => handleArrayChange('rounds', index, { ...round, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Round Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={round.description}
                  onChange={e => handleArrayChange('rounds', index, { ...round, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="Round Description"
                  rows={3}
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem('rounds', index)}
                className="col-span-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Round
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('rounds', { name: "", description: "" })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Round
          </button>
        </section>

        {/* Prizes */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Prizes</h3>
          <div className="space-y-4">
            {form.prizes.map((prize, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prize Type</label>
                  <input
                    type="text"
                    value={prize.type}
                    onChange={e => handleArrayChange("prizes", index, { ...prize, type: e.target.value })}
                    placeholder="e.g., 1st Place"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={e => handleArrayChange("prizes", index, { ...prize, amount: e.target.value })}
                    placeholder="e.g., ₹10,000"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <input
                    type="text"
                    value={prize.details}
                    onChange={e => handleArrayChange("prizes", index, { ...prize, details: e.target.value })}
                    placeholder="Additional details"
                    className={inputClasses}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem("prizes", index)}
                  className="px-3 py-1 bg-red-500 text-white rounded mt-6"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("prizes", { type: "", amount: "", details: "" })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Prize
            </button>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">FAQs</h3>
          {form.faqs.map((faq, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={faq.question}
                onChange={e => handleArrayChange("faqs", index, { ...faq, question: e.target.value })}
                placeholder="Question"
                className={inputClasses}
              />
              <input
                type="text"
                value={faq.answer}
                onChange={e => handleArrayChange("faqs", index, { ...faq, answer: e.target.value })}
                placeholder="Answer"
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => removeArrayItem("faqs", index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("faqs", { question: "", answer: "" })}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add FAQ
          </button>
        </section>

        {/* Contact and Mode */}
        <section className="space-y-4 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold border-b pb-2">Contact and Mode</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Help Contact</label>
              <input
                type="text"
                name="helpContact"
                value={form.helpContact}
                onChange={handleChange}
                placeholder="e.g., email or phone"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-semibold rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Creating..." : "Create Hackathon"}
        </button>
      </form>
    </div>
  );
}