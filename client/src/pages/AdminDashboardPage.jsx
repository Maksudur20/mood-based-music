import React, { useState, useEffect } from 'react';
import { Shield, Users, Music, Heart, Search, Activity, Plus, Trash2 } from 'lucide-react';
import api from '../services/api.js';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [moods, setMoods] = useState([]);
  const [selectedMoodId, setSelectedMoodId] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, moodsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/moods')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      const mList = moodsRes.data.moods || [];
      setMoods(mList);
      if (mList.length > 0) setSelectedMoodId(mList[0].id);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim() || !selectedMoodId) return;

    try {
      await api.post(`/moods/${selectedMoodId}/keywords`, { keyword: newKeyword.trim() });
      setNewKeyword('');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteKeyword = async (keywordId) => {
    try {
      await api.delete(`/moods/keywords/${keywordId}`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading admin analytics...</div>;
  }

  const selectedMood = moods.find(m => m.id === selectedMoodId);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-amber-400" />
          <span>Administrator Control Center</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor application usage, manage user accounts, and configure mood search keywords.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Users className="w-5 h-5 text-indigo-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Total Users</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Music className="w-5 h-5 text-purple-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalPlaylists || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Playlists</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Heart className="w-5 h-5 text-red-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalFavorites || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Favorites</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Activity className="w-5 h-5 text-emerald-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalPlays || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Music Plays</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Search className="w-5 h-5 text-amber-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalSearches || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Searches</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <Shield className="w-5 h-5 text-pink-400" />
          <p className="text-2xl font-bold text-white">{stats?.totalMoods || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Moods</p>
        </div>
      </div>

      {/* Mood Keywords Manager */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-400" />
          <span>Mood Keywords Management</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedMoodId}
            onChange={(e) => setSelectedMoodId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            {moods.map(m => (
              <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
            ))}
          </select>

          <form onSubmit={handleAddKeyword} className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder={`Add keyword for ${selectedMood?.name || 'mood'}...`}
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Keyword</span>
            </button>
          </form>
        </div>

        {/* Existing Keywords List */}
        {selectedMood && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedMood.mood_keywords?.map(kw => (
              <span
                key={kw.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200"
              >
                <span>{kw.keyword}</span>
                <button
                  onClick={() => handleDeleteKeyword(kw.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Registered Users Table */}
      <section className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>User Management</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-3">
                    <img src={u.profile_image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
