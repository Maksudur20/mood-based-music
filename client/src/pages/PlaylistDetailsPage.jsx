import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Music, Play, Trash2, ArrowLeft } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.jsx';
import api from '../services/api.js';

export const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/playlists/${id}`);
      setPlaylist(res.data.playlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.delete(`/playlists/${id}`);
      navigate('/library');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSong = async (videoId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/playlists/${id}/songs/${videoId}`);
      setPlaylist(prev => ({
        ...prev,
        playlist_songs: prev.playlist_songs.filter(s => s.video_id !== videoId)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading playlist details...</div>;
  }

  if (!playlist) {
    return <div className="text-center py-20 text-slate-400">Playlist not found.</div>;
  }

  const songs = playlist.playlist_songs || [];

  return (
    <div className="space-y-8 pb-12">
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </button>

      {/* Playlist Header */}
      <div className="glass-panel rounded-3xl p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 border border-slate-800">
        <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl flex-shrink-0">
          <Music className="w-16 h-16 text-white" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Playlist</span>
          <h1 className="text-3xl font-black text-white">{playlist.name}</h1>
          <p className="text-sm text-slate-300">{playlist.description || `${songs.length} songs`}</p>
        </div>

        <div className="flex items-center gap-3">
          {songs.length > 0 && (
            <button
              onClick={() => playTrack({
                videoId: songs[0].video_id,
                title: songs[0].title,
                thumbnailUrl: songs[0].thumbnail_url,
                channelTitle: songs[0].channel_title
              }, songs.map(s => ({
                videoId: s.video_id,
                title: s.title,
                thumbnailUrl: s.thumbnail_url,
                channelTitle: s.channel_title
              })))}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play All</span>
            </button>
          )}

          <button
            onClick={handleDeletePlaylist}
            className="p-2.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            title="Delete Playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Playlist Songs List */}
      <div className="space-y-2">
        {songs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No songs added to this playlist yet.</p>
          </div>
        ) : (
          songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => playTrack({
                videoId: song.video_id,
                title: song.title,
                thumbnailUrl: song.thumbnail_url,
                channelTitle: song.channel_title
              }, songs.map(s => ({
                videoId: s.video_id,
                title: s.title,
                thumbnailUrl: s.thumbnail_url,
                channelTitle: s.channel_title
              })))}
              className="glass-card rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-sm font-bold text-slate-500 w-5 text-center">{index + 1}</span>
                <img src={song.thumbnail_url} alt={song.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{song.channel_title}</p>
                </div>
              </div>

              <button
                onClick={(e) => handleRemoveSong(song.video_id, e)}
                className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from Playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
