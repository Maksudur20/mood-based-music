import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const MusicCard = ({ track, trackList = [], onOpenPlaylistModal, onOpenAuth }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = currentTrack?.videoId === track.videoId;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, trackList);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${track.videoId}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', {
          video_id: track.videoId,
          title: track.title,
          thumbnail_url: track.thumbnailUrl,
          channel_title: track.channelTitle
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-2xl p-3.5 flex flex-col justify-between group cursor-pointer"
      onClick={handlePlayClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-900">
        <img
          src={track.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
          isCurrent || isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 transform group-hover:scale-110 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Favorite & Playlist Quick Actions */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleFavoriteClick}
            className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-slate-900 transition-all"
            title="Add to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                onOpenAuth();
              } else {
                onOpenPlaylistModal(track);
              }
            }}
            className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-indigo-300 hover:bg-slate-900 transition-all"
            title="Add to Playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track Information */}
      <div className="space-y-1">
        <h4 className={`font-semibold text-sm line-clamp-2 transition-colors ${
          isCurrent ? 'text-indigo-400' : 'text-slate-100 group-hover:text-indigo-300'
        }`}>
          {track.title}
        </h4>
        <p className="text-xs text-slate-400 font-medium truncate">
          {track.channelTitle || 'YouTube Artist'}
        </p>
      </div>
    </div>
  );
};
