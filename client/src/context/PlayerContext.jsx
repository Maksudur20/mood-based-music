import React, { createContext, useContext, useState } from 'react';
import api from '../services/api.js';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [activeMood, setActiveMood] = useState(null);
  const [favoritesMap, setFavoritesMap] = useState({});

  const playTrack = (track, trackList = [], mood = null) => {
    if (!track || !track.videoId) return;

    setCurrentTrack(track);
    setIsPlaying(true);
    if (mood) setActiveMood(mood);

    if (trackList.length > 0) {
      setQueue(trackList);
      const index = trackList.findIndex(t => t.videoId === track.videoId);
      setQueueIndex(index !== -1 ? index : 0);
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }

    // Log history to server (fire and forget)
    api.post('/history', {
      video_id: track.videoId,
      title: track.title,
      thumbnail_url: track.thumbnailUrl,
      channel_title: track.channelTitle,
      mood_id: mood?.id || null
    }).catch(() => {});
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying(prev => !prev);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIdx = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIdx);
    setCurrentTrack(queue[nextIdx]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    setCurrentTrack(queue[prevIdx]);
    setIsPlaying(true);
  };

  const setFavoriteState = (videoId, isFav) => {
    setFavoritesMap(prev => ({ ...prev, [videoId]: isFav }));
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      queue,
      queueIndex,
      activeMood,
      favoritesMap,
      playTrack,
      togglePlayPause,
      playNext,
      playPrevious,
      setActiveMood,
      setFavoriteState,
      setIsPlaying
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
