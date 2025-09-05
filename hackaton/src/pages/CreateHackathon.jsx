import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHackathon } from '../api';

export default function CreateHackathon() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    banner: '',
    poster: '',
    title: '',
    overview: '',
    rules: [''],
    criteria: '',
    timeline: {
      registration: '',
      rounds: [{ name: '', startDate: '', endDate: '', description: '' }],
      result: ''
    },
    prizes: [{ position: '', amount: '', description: '' }],
    gallery: [''],
    faqs: [{ question: '', answer: '' }],
    updates: '',
    helpContact: '',
    mode: 'ONLINE',
    teamSize: { min: 1, max: 4 },
    domain: '',
    skillsRequired: [''],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createHackathon(form);
    if (!result.error) {
      navigate('/host/dashboard');
    }
  };

  const addListItem = (field, emptyItem) => {
    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], emptyItem]
    }));
  };

  const updateListItem = (field, index, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create Hackathon</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Banner URL</label>
            <input
              type="url"
              value={form.banner}
              onChange={e => setForm({...form, banner: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Poster URL</label>
            <input
              type="url"
              value={form.poster}
              onChange={e => setForm({...form, poster: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              required
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Overview *</label>
            <textarea
              required
              value={form.overview}
              onChange={e => setForm({...form, overview: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
              rows={4}
            />
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
            {form.rules.map((rule, index) => (
              <input
                key={index}
                type="text"
                value={rule}
                onChange={e => updateListItem('rules', index, e.target.value)}
                className="mt-1 block w-full rounded-md border p-2"
              />
            ))}
            {form.rules.length < 10 && (
              <button
                type="button"
                onClick={() => addListItem('rules', '')}
                className="mt-2 text-blue-600"
              >
                + Add Rule
              </button>
            )}
          </div>

          {/* Timeline & Rounds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
            <div className="space-y-4">
              {form.timeline.rounds.map((round, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <input
                    type="text"
                    placeholder="Round Name"
                    value={round.name}
                    onChange={e => {
                      const newRounds = [...form.timeline.rounds];
                      newRounds[index] = {...round, name: e.target.value};
                      setForm(prev => ({
                        ...prev,
                        timeline: {...prev.timeline, rounds: newRounds}
                      }));
                    }}
                    className="block w-full rounded-md border p-2 mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={round.startDate}
                      onChange={e => {
                        const newRounds = [...form.timeline.rounds];
                        newRounds[index] = {...round, startDate: e.target.value};
                        setForm(prev => ({
                          ...prev,
                          timeline: {...prev.timeline, rounds: newRounds}
                        }));
                      }}
                      className="block w-full rounded-md border p-2"
                    />
                    <input
                      type="date"
                      value={round.endDate}
                      onChange={e => {
                        const newRounds = [...form.timeline.rounds];
                        newRounds[index] = {...round, endDate: e.target.value};
                        setForm(prev => ({
                          ...prev,
                          timeline: {...prev.timeline, rounds: newRounds}
                        }));
                      }}
                      className="block w-full rounded-md border p-2"
                    />
                  </div>
                </div>
              ))}
              {form.timeline.rounds.length < 3 && (
                <button
                  type="button"
                  onClick={() => {
                    const newRounds = [...form.timeline.rounds, {
                      name: '',
                      startDate: '',
                      endDate: '',
                      description: ''
                    }];
                    setForm(prev => ({
                      ...prev,
                      timeline: {...prev.timeline, rounds: newRounds}
                    }));
                  }}
                  className="text-blue-600"
                >
                  + Add Round
                </button>
              )}
            </div>
          </div>

          {/* Other Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select
                value={form.mode}
                onChange={e => setForm({...form, mode: e.target.value})}
                className="mt-1 block w-full rounded-md border p-2"
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Domain</label>
              <input
                type="text"
                value={form.domain}
                onChange={e => setForm({...form, domain: e.target.value})}
                className="mt-1 block w-full rounded-md border p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/host/dashboard')}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create Hackathon
          </button>
        </div>
      </form>
    </div>
  );
}
