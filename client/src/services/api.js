// 100% Standalone Offline Local Storage API Engine

const LOCAL_MOODS = [
  { id: '1', name: 'Happy', icon: '😊', description: 'Upbeat and cheerful tracks to boost your day', gradient_from: '#f59e0b', gradient_to: '#ef4444' },
  { id: '2', name: 'Chill', icon: '🎧', description: 'Relaxing lo-fi and ambient sounds', gradient_from: '#6366f1', gradient_to: '#a855f7' },
  { id: '3', name: 'Energetic', icon: '⚡', description: 'High-energy workout and hype beats', gradient_from: '#ef4444', gradient_to: '#ec4899' },
  { id: '4', name: 'Sad', icon: '🌧️', description: 'Melancholic and emotional melodies', gradient_from: '#3b82f6', gradient_to: '#6366f1' },
  { id: '5', name: 'Focus', icon: '🎯', description: 'Instrumental music for study and deep focus', gradient_from: '#10b981', gradient_to: '#06b6d4' },
  { id: '6', name: 'Romantic', icon: '💖', description: 'Love songs and soft acoustics', gradient_from: '#ec4899', gradient_to: '#f43f5e' },
  { id: '7', name: 'Party', icon: '🎉', description: 'Dance, EDM and club anthems', gradient_from: '#8b5cf6', gradient_to: '#d946ef' },
  { id: '8', name: 'Relaxed', icon: '🌙', description: 'Calming sounds to unwind and sleep', gradient_from: '#0284c7', gradient_to: '#6366f1' }
];

const LOCAL_TRACKS = {
  happy: [
    { videoId: 'ZbZSe6N_BXs', title: 'Happy - Pharrell Williams (Official Video)', description: 'Feel good upbeat hits', channelTitle: 'Pharrell Williams', thumbnailUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg' },
    { videoId: '09R8_2nJtjg', title: 'Sugar - Maroon 5', description: 'Upbeat pop tunes', channelTitle: 'Maroon 5', thumbnailUrl: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg' },
    { videoId: 'ru0KmrIhBLw', title: 'Can\'t Stop the Feeling! - Justin Timberlake', description: 'Dance & feel good vibe', channelTitle: 'Justin Timberlake', thumbnailUrl: 'https://i.ytimg.com/vi/ru0KmrIhBLw/hqdefault.jpg' },
    { videoId: 'OPf0YbXqDm0', title: 'Uptown Funk - Mark Ronson ft. Bruno Mars', description: 'Funk & upbeat rhythms', channelTitle: 'Mark Ronson', thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
    { videoId: 'TUVcZfQe-Kw', title: 'Dua Lipa - Levitating', description: 'Pop dance euphoria', channelTitle: 'Dua Lipa', thumbnailUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg' },
    { videoId: 'nfWlot6h_JM', title: 'Taylor Swift - Shake It Off', description: 'Pop chart topper', channelTitle: 'Taylor Swift', thumbnailUrl: 'https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg' }
  ],
  chill: [
    { videoId: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill to', description: 'Peaceful lo-fi beats for sleeping and unwinding.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { videoId: '4xDzrJKXOOY', title: 'Synthwave Radio - Chill & Retro Beats', description: 'Retro synthwave and night drive tunes.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg' },
    { videoId: 'DWcJFNfaw9c', title: 'Calm Piano Music - Peaceful Relaxation & Study', description: 'Peaceful piano and acoustic ambient melodies.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { videoId: '3JZ_D3ELwOQ', title: 'Best Ambient Chillout Music Playlist', description: 'Soft instrumental background music.', channelTitle: 'Ambient Chill', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' },
    { videoId: 'fJ9rUzIMcZQ', title: 'Classic Melodic Harmonies Collection', description: 'Timeless melodic compositions.', channelTitle: 'Music Harmonies', thumbnailUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg' }
  ],
  energetic: [
    { videoId: 'btPJPFnesV4', title: 'Eye of the Tiger - Survivor', description: 'Ultimate workout motivation', channelTitle: 'Survivor', thumbnailUrl: 'https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg' },
    { videoId: 'IcrbM1l_BoI', title: 'Avicii - Wake Me Up', description: 'High energy electronic anthem', channelTitle: 'Avicii', thumbnailUrl: 'https://i.ytimg.com/vi/IcrbM1l_BoI/hqdefault.jpg' },
    { videoId: 'OPf0YbXqDm0', title: 'Uptown Funk - Mark Ronson ft. Bruno Mars', description: 'Funk & hype rhythms', channelTitle: 'Mark Ronson', thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg' }
  ],
  sad: [
    { videoId: 'RBumgq5yVrA', title: 'Passenger - Let Her Go', description: 'Acoustic emotional ballad', channelTitle: 'Passenger', thumbnailUrl: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg' },
    { videoId: 'hLQl3WQQoQ0', title: 'Adele - Someone Like You', description: 'Heartfelt piano ballad', channelTitle: 'Adele', thumbnailUrl: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg' },
    { videoId: 'k4V3Mo61fJM', title: 'Coldplay - Fix You', description: 'Emotional rock ballad', channelTitle: 'Coldplay', thumbnailUrl: 'https://i.ytimg.com/vi/k4V3Mo61fJM/hqdefault.jpg' },
    { videoId: 'zABLecsR5UE', title: 'Lewis Capaldi - Someone You Loved', description: 'Soul-stirring piano acoustic', channelTitle: 'Lewis Capaldi', thumbnailUrl: 'https://i.ytimg.com/vi/zABLecsR5UE/hqdefault.jpg' }
  ],
  focus: [
    { videoId: 'DWcJFNfaw9c', title: 'Deep Focus Instrumental Study Music', description: 'Instrumental piano for maximum concentration.', channelTitle: 'Study Focus', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { videoId: '3JZ_D3ELwOQ', title: 'Alpha Waves Brainwave Music for Focus', description: 'Binaural beats for mental clarity.', channelTitle: 'Focus Music', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' }
  ],
  romantic: [
    { videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', description: 'Romantic wedding & love ballad', channelTitle: 'Ed Sheeran', thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg' },
    { videoId: '450p7goxZqg', title: 'John Legend - All of Me', description: 'Piano love ballad', channelTitle: 'John Legend', thumbnailUrl: 'https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg' }
  ],
  party: [
    { videoId: '5dbM_V01dNE', title: 'Daft Punk - Get Lucky', description: 'Disco funk dance hit', channelTitle: 'Daft Punk', thumbnailUrl: 'https://i.ytimg.com/vi/5dbM_V01dNE/hqdefault.jpg' },
    { videoId: 'eVTXPUfcB70', title: 'Calvin Harris - Summer', description: 'Summer dance festival anthem', channelTitle: 'Calvin Harris', thumbnailUrl: 'https://i.ytimg.com/vi/eVTXPUfcB70/hqdefault.jpg' }
  ],
  relaxed: [
    { videoId: '5qap5aO4i9A', title: 'Gentle Sleep & Relaxation Music', description: 'Calming sounds to unwind and sleep.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { videoId: 'DWcJFNfaw9c', title: 'Acoustic Guitar & Ocean Waves', description: 'Soft soothing acoustic strings.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' }
  ]
};

// Helper for local storage arrays
const getLocalData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

// 100% Offline Supabase Client Mock
export const supabase = {
  auth: {
    async getSession() {
      const user = JSON.parse(localStorage.getItem('mood_offline_user') || 'null');
      if (user) {
        return { data: { session: { user, access_token: 'offline_token' } } };
      }
      return { data: { session: null } };
    },
    onAuthStateChange(callback) {
      const user = JSON.parse(localStorage.getItem('mood_offline_user') || 'null');
      if (user) {
        callback('SIGNED_IN', { user, access_token: 'offline_token' });
      } else {
        callback('SIGNED_OUT', null);
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    async signInWithPassword({ email }) {
      const user = { id: 'offline-user-1', email, user_metadata: { name: email.split('@')[0] } };
      localStorage.setItem('mood_offline_user', JSON.stringify(user));
      return { data: { user, session: { access_token: 'offline_token' } }, error: null };
    },
    async signUp({ email, options }) {
      const user = { id: 'offline-user-1', email, user_metadata: { name: options?.data?.name || email.split('@')[0] } };
      localStorage.setItem('mood_offline_user', JSON.stringify(user));
      return { data: { user, session: { access_token: 'offline_token' } }, error: null };
    },
    async signOut() {
      localStorage.removeItem('mood_offline_user');
      return { error: null };
    }
  }
};

// Standalone Client-Side API Mock Adapter
const api = {
  async get(url) {
    const cleanUrl = url.split('?')[0];

    if (cleanUrl.includes('/moods')) {
      const moodId = cleanUrl.split('/moods/')[1];
      if (moodId) {
        const found = LOCAL_MOODS.find(m => m.id === moodId || m.name.toLowerCase() === moodId.toLowerCase());
        return { data: { mood: found || LOCAL_MOODS[0] } };
      }
      return { data: { moods: LOCAL_MOODS } };
    }

    if (cleanUrl.includes('/youtube/mood/')) {
      const moodName = cleanUrl.split('/youtube/mood/')[1]?.toLowerCase();
      const tracks = LOCAL_TRACKS[moodName] || LOCAL_TRACKS.chill;
      return { data: { mood: moodName, count: tracks.length, results: tracks } };
    }

    if (cleanUrl.includes('/youtube/search') || cleanUrl.includes('/youtube')) {
      const allTracks = Object.values(LOCAL_TRACKS).flat();
      const searchQuery = (url.split('q=')[1] || '').split('&')[0].toLowerCase();
      if (searchQuery) {
        const decodedQuery = decodeURIComponent(searchQuery);
        const filtered = allTracks.filter(t => 
          t.title.toLowerCase().includes(decodedQuery) || 
          t.channelTitle.toLowerCase().includes(decodedQuery) ||
          t.description.toLowerCase().includes(decodedQuery)
        );
        return { data: { count: filtered.length, results: filtered.length > 0 ? filtered : allTracks } };
      }
      return { data: { count: allTracks.length, results: allTracks } };
    }

    if (cleanUrl.includes('/favorites')) {
      return { data: { favorites: getLocalData('mood_favorites') } };
    }

    if (cleanUrl.includes('/history')) {
      return { data: { history: getLocalData('mood_history') } };
    }

    if (cleanUrl.includes('/playlists')) {
      return { data: { playlists: getLocalData('mood_playlists') } };
    }

    if (cleanUrl.includes('/auth/me')) {
      const user = JSON.parse(localStorage.getItem('mood_offline_user') || 'null');
      return { data: { profile: user ? { ...user, role: 'user' } : null } };
    }

    return { data: {} };
  },

  async post(url, body) {
    if (url.includes('/favorites')) {
      const current = getLocalData('mood_favorites');
      const updated = [body, ...current.filter(f => f.video_id !== body.video_id)];
      setLocalData('mood_favorites', updated);
      return { data: { message: 'Added to favorites', favorite: body } };
    }

    if (url.includes('/history')) {
      const current = getLocalData('mood_history');
      const updated = [body, ...current.slice(0, 49)];
      setLocalData('mood_history', updated);
      return { data: { message: 'History saved' } };
    }

    if (url.includes('/playlists')) {
      const current = getLocalData('mood_playlists');
      const newPlaylist = { id: Date.now().toString(), name: body.name || 'My Playlist', tracks: body.tracks || [] };
      const updated = [...current, newPlaylist];
      setLocalData('mood_playlists', updated);
      return { data: { playlist: newPlaylist } };
    }

    return { data: {} };
  },

  async delete(url) {
    if (url.includes('/favorites')) {
      const videoId = url.split('/favorites/')[1];
      const current = getLocalData('mood_favorites');
      const updated = current.filter(f => f.video_id !== videoId && f.id !== videoId);
      setLocalData('mood_favorites', updated);
      return { data: { message: 'Removed from favorites' } };
    }

    if (url.includes('/playlists')) {
      const playlistId = url.split('/playlists/')[1];
      const current = getLocalData('mood_playlists');
      const updated = current.filter(p => p.id !== playlistId);
      setLocalData('mood_playlists', updated);
      return { data: { message: 'Playlist deleted' } };
    }

    return { data: {} };
  },

  interceptors: {
    request: { use: () => {} }
  }
};

export default api;
