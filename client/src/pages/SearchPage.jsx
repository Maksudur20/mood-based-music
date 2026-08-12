import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Music } from 'lucide-react';
import { MusicCard } from '../components/MusicCard.jsx';
import api from '../services/api.js';

export const SearchPage = ({ onOpenPlaylistModal, onOpenAuth }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputQuery, setInputQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await api.get(`/youtube/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Search className="w-7 h-7 text-indigo-400" />
          <span>Search Music</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Search YouTube's music catalog by title, artist, or genre.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Type a song title, artist name, or genre..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-28 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-300">
            Results for <span className="text-white">"{query}"</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-2xl">
              <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No music results found for "{query}".</p>
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
        </div>
      )}
    </div>
  );
};
