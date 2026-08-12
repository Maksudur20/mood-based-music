import React, { useState } from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
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
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
          isHovered || isCurrent ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transform group-hover:scale-110 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Playing Indicator Badge */}
        {isCurrent && (
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-indigo-500/90 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Playing
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm leading-snug truncate ${isCurrent ? 'text-indigo-400 font-bold' : 'text-slate-100'}`}>
            {track.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5">{track.channelTitle}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${isFavorite ? 'text-pink-500' : 'text-slate-400 hover:text-white'}`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
          </button>
          
          {onOpenPlaylistModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  onOpenAuth();
                  return;
                }
                onOpenPlaylistModal(track);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Add to Playlist"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
