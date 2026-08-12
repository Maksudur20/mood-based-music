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
    try {
      const res = await api.get(`/youtube/mood/${encodeURIComponent(mood.name)}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
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
            selected={activeMood?.id === m.id}
            onClick={handleSelect}
          />
        ))}
      </div>

      {activeMood && (
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeMood.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{activeMood.name} Vibes</h2>
              <p className="text-xs text-slate-400">{activeMood.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
          )}
        </section>
      )}
    </div>
  );
};
