import React, { useState, useEffect } from 'react';
import { Sparkles, Music, Flame, History, ArrowRight } from 'lucide-react';
import { MoodCard } from '../components/MoodCard.jsx';
import { MusicCard } from '../components/MusicCard.jsx';
import api from '../services/api.js';

export const HomePage = ({ onOpenPlaylistModal, onOpenAuth }) => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
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
      const moodList = res.data.moods || [];
      setMoods(moodList);
      if (moodList.length > 0) {
        handleSelectMood(moodList[0]);
      }
    } catch (err) {
      console.error('Fetch moods error:', err);
    }
  };

  const handleSelectMood = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const res = await api.get(`/youtube/mood/${encodeURIComponent(mood.name)}?page=1`);
      setRecommendations(res.data.results || []);
    } catch (err) {
      console.error('Fetch recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTracks = async () => {
    if (!selectedMood || loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.get(`/youtube/mood/${encodeURIComponent(selectedMood.name)}?page=${nextPage}`);
      const newTracks = res.data.results || [];
      if (newTracks.length === 0) {
        setHasMore(false);
      } else {
        setRecommendations(prev => {
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
  }, [selectedMood, page, loading, loadingMore, hasMore]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-slate-800/80 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 glass-panel shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>AI Mood Music Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              How are you <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">feeling</span> today?
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Select your current emotional state and let our recommendation system curate perfect YouTube music tracks matched to your vibe.
            </p>
          </div>

          {/* Aesthetic Centered Logo Graphic Badge */}
          <div className="hidden sm:flex items-center justify-center w-36 h-36 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-purple-500/40 shrink-0 transform hover:rotate-3 hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-950/80 backdrop-blur-xl rounded-[22px] flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Music className="w-12 h-12 text-white stroke-[2.2]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mood Selector Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Select Your Mood</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              isSelected={selectedMood?.id === mood.id}
              onSelect={handleSelectMood}
            />
          ))}
        </div>
      </section>

      {/* Recommended Tracks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              {selectedMood ? (
                <span>{selectedMood.icon} {selectedMood.name} Recommendations</span>
              ) : (
                <>
                  <Music className="w-5 h-5 text-purple-400" />
                  <span>Recommended Music</span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {selectedMood?.description || 'Handpicked tracks matching your selected mood'}
            </p>
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
        ) : recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendations.map((track) => (
                <MusicCard
                  key={track.videoId}
                  track={track}
                  trackList={recommendations}
                  onOpenPlaylistModal={onOpenPlaylistModal}
                  onOpenAuth={onOpenAuth}
                />
              ))}
            </div>

            {/* Glowing Infinite Scroll Loading Spinner */}
            {loadingMore && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-sm font-semibold animate-pulse shadow-lg shadow-indigo-500/20">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more music for your vibe...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No recommendations found for this mood.</p>
          </div>
        )}
      </section>
    </div>
  );
};
