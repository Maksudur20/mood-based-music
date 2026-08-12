import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Library, Music, History, Plus, Trash2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import { MusicCard } from '../components/MusicCard.jsx';
import api from '../services/api.js';

export const LibraryPage = ({ onOpenPlaylistModal, onOpenAuth }) => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLibraryData();
    }
  }, [user]);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      const [favRes, playRes, histRes] = await Promise.all([
        api.get('/favorites'),
        api.get('/playlists'),
        api.get('/history')
      ]);

      setFavorites(favRes.data.favorites || []);
      setPlaylists(playRes.data.playlists || []);
      setHistory(histRes.data.history || []);
    } catch (err) {
      console.error('Library fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 glass-panel rounded-3xl max-w-lg mx-auto my-12 p-8 space-y-4">
        <Library className="w-16 h-16 text-indigo-400 mx-auto opacity-80" />
        <h2 className="text-2xl font-bold text-white">Your Personal Library</h2>
        <p className="text-slate-400 text-sm">
          Sign in to save your favorite songs, create custom playlists, and track your listening history.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Library className="w-7 h-7 text-purple-400" />
          <span>My Music Library</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your saved songs, custom playlists, and watch history.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 pb-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'favorites'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 pb-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'playlists'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Playlists ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Played ({history.length})</span>
        </button>
      </div>

      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No favorite songs added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favorites.map((fav) => {
                const track = {
                  videoId: fav.video_id,
                  title: fav.title,
                  thumbnailUrl: fav.thumbnail_url,
                  channelTitle: fav.channel_title
                };
                return (
                  <MusicCard
                    key={fav.id}
                    track={track}
                    trackList={favorites.map(f => ({
                      videoId: f.video_id,
                      title: f.title,
                      thumbnailUrl: f.thumbnail_url,
                      channelTitle: f.channel_title
                    }))}
                    onOpenPlaylistModal={onOpenPlaylistModal}
                    onOpenAuth={onOpenAuth}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Playlists Tab Content */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              to={`/playlist/${pl.id}`}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between group hover:border-indigo-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  {pl.playlist_songs?.length || 0} tracks
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {pl.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {pl.description || 'Custom playlist'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Listening History Tab Content */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No listening history recorded yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => playTrack({
                  videoId: item.video_id,
                  title: item.title,
                  thumbnailUrl: item.thumbnail_url,
                  channelTitle: item.channel_title
                })}
                className="glass-card rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{item.channel_title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    {new Date(item.played_at).toLocaleDateString()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
