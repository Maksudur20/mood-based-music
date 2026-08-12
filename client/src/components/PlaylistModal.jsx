import React, { useState, useEffect } from 'react';
import { X, Plus, Music, Check } from 'lucide-react';
import api from '../services/api.js';

export const PlaylistModal = ({ track, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await api.get('/playlists');
      setPlaylists(res.data.playlists || []);
    } catch (err) {
      console.error('Fetch playlists error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setCreating(true);
      const res = await api.post('/playlists', { name: newPlaylistName.trim() });
      const created = res.data.playlist;
      setPlaylists([created, ...playlists]);
      setNewPlaylistName('');
    } catch (err) {
      console.error('Create playlist error:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await api.post(`/playlists/${playlistId}/songs`, {
        video_id: track.videoId,
        title: track.title,
        thumbnail_url: track.thumbnailUrl,
        channel_title: track.channelTitle
      });
      setAddedMap(prev => ({ ...prev, [playlistId]: true }));
    } catch (err) {
      if (err.response?.status === 409) {
        setAddedMap(prev => ({ ...prev, [playlistId]: true }));
      }
    }
  };

  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl w-full max-w-md p-6 border border-slate-700/80 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="font-bold text-lg text-white">Add to Playlist</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Track Preview */}
        <div className="flex items-center gap-3 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <img src={track.thumbnailUrl} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
            <p className="text-xs text-slate-400 truncate">{track.channelTitle}</p>
          </div>
        </div>

        {/* Create New Playlist Input */}
        <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={creating || !newPlaylistName.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </form>

        {/* Playlists List */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-4">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No playlists created yet.</p>
          ) : (
            playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => handleAddToPlaylist(pl.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/60 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{pl.name}</p>
                    <p className="text-[11px] text-slate-400">{pl.playlist_songs?.length || 0} songs</p>
                  </div>
                </div>

                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors">
                  {addedMap[pl.id] ? (
                    <span className="flex items-center gap-1 text-emerald-400"><Check className="w-3.5 h-3.5" /> Added</span>
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
