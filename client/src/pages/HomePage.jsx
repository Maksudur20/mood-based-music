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
    try {
      const res = await api.get(`/youtube/mood/${encodeURIComponent(mood.name)}`);
      setRecommendations(res.data.results || []);
    } catch (err) {
      console.error('Fetch recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
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

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Select your current emotional state and let our recommendation system curate perfect YouTube music tracks matched to your vibe.
            </p>
          </div>

          {/* Glowing Brand Logo Badge */}
          <div className="relative flex-shrink-0 group hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
            <img src="/logo.svg" alt="MoodHarmonies" className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Mood Selector Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Select Your Mood</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moods.slice(0, 10).map((m) => (
            <MoodCard
              key={m.id}
              mood={m}
              selected={selectedMood?.id === m.id}
              onClick={handleSelectMood}
            />
          ))}
        </div>
      </section>

      {/* Recommended Music Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedMood?.icon || '🎵'}</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedMood ? `${selectedMood.name} Recommendations` : 'Recommended Music'}
              </h2>
              <p className="text-xs text-slate-400">Handpicked tracks matching your selected mood</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-slate-900/60 border border-slate-800" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No recommendations found for this mood.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
        )}
      </section>

    </div>
  );
};
