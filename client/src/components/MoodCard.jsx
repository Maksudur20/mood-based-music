import React from 'react';
import { Play } from 'lucide-react';

export const MoodCard = ({ mood, onClick, selected = false }) => {
  const { name, icon, description, gradient_from = '#6366f1', gradient_to = '#a855f7' } = mood;

  return (
    <button
      onClick={() => onClick(mood)}
      className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none w-full ${
        selected
          ? 'ring-2 ring-indigo-400 shadow-2xl scale-[1.02]'
          : 'hover:shadow-xl'
      }`}
      style={{
        background: `linear-gradient(135deg, ${gradient_from}22 0%, ${gradient_to}33 100%)`,
        borderColor: selected ? gradient_from : `${gradient_from}44`,
        borderWidth: '1px'
      }}
    >
      {/* Decorative Glow */}
      <div
        className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity"
        style={{ background: gradient_to }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <span className="text-4xl sm:text-5xl filter drop-shadow-md transform group-hover:scale-110 transition-transform">
            {icon}
          </span>
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:bg-white/20 transition-all">
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-indigo-200 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {description || `Discover curated ${name.toLowerCase()} music recommendations.`}
          </p>
        </div>
      </div>
    </button>
  );
};
