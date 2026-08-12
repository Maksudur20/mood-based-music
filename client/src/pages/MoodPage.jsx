import React, { useState, useEffect } from 'react';
import { Sparkles, Music } from 'lucide-react';
import { MoodCard } from '../components/MoodCard.jsx';
import { MusicCard } from '../components/MusicCard.jsx';
import api from '../services/api.js';

export const MoodPage = ({ onOpenPlaylistModal, onOpenAuth }) => {
  const [moods, setMoods] = useState([]);
  const [activeMood, setActiveMood] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await api.get('/moods');
      const list = res.data.moods || [];
      setMoods(list);
      if (list.length > 0) {
        handleSelect(list[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = async (mood) => {
    setActiveMood(mood);
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const res = await api.get(`/youtube/mood/${encodeURIComponent(mood.name)}?page=1`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTracks = async () => {
    if (!activeMood || loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.get(`/youtube/mood/${encodeURIComponent(activeMood.name)}?page=${nextPage}`);
      const newTracks = res.data.results || [];
      if (newTracks.length === 0) {
        setHasMore(false);
      } else {
        setResults(prev => {
          const existingIds = new Set(prev.map(t => t.videoId));
          const uniqueNew = newTracks.filter(t => !existingIds.has(t.videoId));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more tracks:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 350) {
        loadMoreTracks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMood, page, loading, loadingMore, hasMore]);

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          <span>Explore All Moods</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pick your vibe to stream music instantly tailored for every emotional moment.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {moods.map((m) => (
          <MoodCard
            key={m.id}
            mood={m}
            isSelected={activeMood?.id === m.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {activeMood && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{activeMood.icon} {activeMood.name} Collection</span>
              </h2>
              <p className="text-slate-400 text-sm">{activeMood.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-2xl p-3.5 space-y-3 animate-pulse">
                  <div className="aspect-video bg-slate-800/80 rounded-xl" />
                  <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                  <div className="h-3 bg-slate-800/80 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((track) => (
                  <MusicCard
                    key={track.videoId}
                    track={track}
                    trackList={results}
                    onOpenPlaylistModal={onOpenPlaylistModal}
                    onOpenAuth={onOpenAuth}
                  />
                ))}
              </div>

              {/* Glowing Infinite Scroll Loading Indicator */}
              {loadingMore && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-sm font-semibold animate-pulse shadow-lg shadow-indigo-500/20">
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading more {activeMood.name} music...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No tracks available right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
