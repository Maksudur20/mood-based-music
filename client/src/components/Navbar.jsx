import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, Search, Heart, Library, Shield, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ onOpenAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.svg"
            alt="MoodHarmonies"
            className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25"
          />
          <div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent tracking-tight">
              MoodHarmonies
            </span>
            <span className="hidden sm:block text-[10px] text-indigo-400 font-medium tracking-wider uppercase -mt-1">
              AI & Mood Recommendations
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search songs, artists, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </form>

        {/* Navigation Links & User Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/moods"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/moods')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Moods</span>
          </Link>

          <Link
            to="/library"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/library')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Library className="w-4 h-4 text-purple-400" />
            <span>Library</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/admin')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-700/60 hover:border-indigo-500/50 transition-all bg-slate-900/60"
              >
                <img
                  src={profile?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={profile?.name || user.email}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-slate-200 hidden lg:inline pr-2">
                  {profile?.name || user.email.split('@')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl py-2 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{profile?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setShowDropdown(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
