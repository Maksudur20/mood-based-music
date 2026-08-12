import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Simple in-memory cache to save API quota points
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

const MOOD_FALLBACKS = {
  happy: [
    { videoId: 'ZbZSe6N_BXs', title: 'Happy - Pharrell Williams (Official Music Video)', description: 'Upbeat and feel-good music video.', thumbnailUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg', channelTitle: 'Pharrell Williams' },
    { videoId: '09R8_2nJtjg', title: 'Sugar - Maroon 5', description: 'Upbeat pop tunes', thumbnailUrl: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg', channelTitle: 'Maroon 5' },
    { videoId: 'ru0KmrIhBLw', title: 'Can\'t Stop the Feeling! - Justin Timberlake', description: 'Dance & feel good vibe', thumbnailUrl: 'https://i.ytimg.com/vi/ru0KmrIhBLw/hqdefault.jpg', channelTitle: 'Justin Timberlake' },
    { videoId: 'OPf0YbXqDm0', title: 'Uptown Funk - Mark Ronson ft. Bruno Mars', description: 'Funk & upbeat rhythms', thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg', channelTitle: 'Mark Ronson' },
    { videoId: 'TUVcZfQe-Kw', title: 'Dua Lipa - Levitating', description: 'Pop dance euphoria', thumbnailUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg', channelTitle: 'Dua Lipa' },
    { videoId: 'nfWlot6h_JM', title: 'Taylor Swift - Shake It Off', description: 'Pop chart topper', thumbnailUrl: 'https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg', channelTitle: 'Taylor Swift' }
  ],
  chill: [
    { videoId: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill to', description: 'Peaceful lo-fi beats for sleeping and unwinding.', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg', channelTitle: 'Lofi Girl' },
    { videoId: '4xDzrJKXOOY', title: 'Synthwave Radio - Chill & Retro Beats', description: 'Retro synthwave and night drive tunes.', thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg', channelTitle: 'Lofi Girl' },
    { videoId: 'DWcJFNfaw9c', title: 'Calm Piano Music 24/7 for Peaceful Relaxation', description: 'Peaceful piano and acoustic ambient melodies.', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg', channelTitle: 'Relaxing Music' },
    { videoId: '3JZ_D3ELwOQ', title: 'Best Ambient Chillout Music Playlist', description: 'Soft instrumental background music.', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', channelTitle: 'Ambient Chill' }
  ],
  energetic: [
    { videoId: 'btPJPFnesV4', title: 'Eye of the Tiger - Survivor', description: 'Ultimate workout motivation', thumbnailUrl: 'https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg', channelTitle: 'Survivor' },
    { videoId: 'IcrbM1l_BoI', title: 'Avicii - Wake Me Up', description: 'High energy electronic anthem', thumbnailUrl: 'https://i.ytimg.com/vi/IcrbM1l_BoI/hqdefault.jpg', channelTitle: 'Avicii' },
    { videoId: 'YvkW-M_gL0M', title: 'High Energy Gym Workout Music', description: 'Hard bass workout motivation', thumbnailUrl: 'https://i.ytimg.com/vi/YvkW-M_gL0M/hqdefault.jpg', channelTitle: 'Fitness Music' }
  ],
  sad: [
    { videoId: 'RBumgq5yVrA', title: 'Passenger - Let Her Go', description: 'Acoustic emotional ballad', thumbnailUrl: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg', channelTitle: 'Passenger' },
    { videoId: 'hLQl3WQQoQ0', title: 'Adele - Someone Like You', description: 'Heartfelt piano ballad', thumbnailUrl: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg', channelTitle: 'Adele' },
    { videoId: 'k4V3Mo61fJM', title: 'Coldplay - Fix You', description: 'Emotional rock ballad', thumbnailUrl: 'https://i.ytimg.com/vi/k4V3Mo61fJM/hqdefault.jpg', channelTitle: 'Coldplay' },
    { videoId: 'zABLecsR5UE', title: 'Lewis Capaldi - Someone You Loved', description: 'Soul-stirring piano acoustic', thumbnailUrl: 'https://i.ytimg.com/vi/zABLecsR5UE/hqdefault.jpg', channelTitle: 'Lewis Capaldi' }
  ],
  focus: [
    { videoId: 'DWcJFNfaw9c', title: 'Deep Focus Instrumental Study Music', description: 'Instrumental piano for maximum concentration.', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg', channelTitle: 'Study Focus' },
    { videoId: '3JZ_D3ELwOQ', title: 'Alpha Waves Brainwave Music for Focus', description: 'Binaural beats for mental clarity.', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg', channelTitle: 'Focus Music' },
    { videoId: '4xDzrJKXOOY', title: 'Code & Study Ambient Synth', description: 'Background instrumental synthwave.', thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg', channelTitle: 'Lofi Girl' }
  ],
  romantic: [
    { videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', description: 'Romantic wedding & love ballad', thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg', channelTitle: 'Ed Sheeran' },
    { videoId: '450p7goxZqg', title: 'John Legend - All of Me', description: 'Piano love ballad', thumbnailUrl: 'https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg', channelTitle: 'John Legend' }
  ],
  party: [
    { videoId: '5dbM_V01dNE', title: 'Daft Punk - Get Lucky', description: 'Disco funk dance hit', thumbnailUrl: 'https://i.ytimg.com/vi/5dbM_V01dNE/hqdefault.jpg', channelTitle: 'Daft Punk' },
    { videoId: 'eVTXPUfcB70', title: 'Calvin Harris - Summer', description: 'Summer dance festival anthem', thumbnailUrl: 'https://i.ytimg.com/vi/eVTXPUfcB70/hqdefault.jpg', channelTitle: 'Calvin Harris' }
  ],
  relaxed: [
    { videoId: '5qap5aO4i9A', title: 'Gentle Sleep & Relaxation Music', description: 'Calming sounds to unwind and sleep.', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg', channelTitle: 'Relaxing Music' },
    { videoId: 'DWcJFNfaw9c', title: 'Acoustic Guitar & Ocean Waves', description: 'Soft soothing acoustic strings.', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg', channelTitle: 'Relaxing Music' }
  ]
};

const getFallbackByQuery = (q) => {
  const queryLower = (q || '').toLowerCase();
  for (const moodKey of Object.keys(MOOD_FALLBACKS)) {
    if (queryLower.includes(moodKey)) {
      return MOOD_FALLBACKS[moodKey];
    }
  }
  return MOOD_FALLBACKS.happy;
};

export const searchYouTube = async (query, maxResults = 15) => {
  if (!query) return MOOD_FALLBACKS.happy;

  const cacheKey = `search:${query.trim().toLowerCase()}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes('your_youtube_api_key')) {
    return getFallbackByQuery(query);
  }

  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: `${query} music`,
        type: 'video',
        videoCategory: '10',
        maxResults,
        key: YOUTUBE_API_KEY
      }
    });

    const items = response.data.items || [];
    const formattedVideos = items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    if (formattedVideos.length === 0) return getFallbackByQuery(query);

    cache.set(cacheKey, { data: formattedVideos, timestamp: Date.now() });
    return formattedVideos;
  } catch (err) {
    console.warn('YouTube API Error or Quota limit, serving mood fallback tracks:', err.message);
    return getFallbackByQuery(query);
  }
};

export const getVideoDetails = async (videoId) => {
  if (!videoId) return null;

  const cacheKey = `video:${videoId}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes('your_youtube_api_key')) {
    return {
      videoId,
      title: 'YouTube Track',
      description: 'Music track',
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channelTitle: 'MoodHarmonies',
      duration: 'PT3M45S',
      viewCount: '100000',
      likeCount: '5000',
      publishedAt: new Date().toISOString()
    };
  }

  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY
      }
    });

    const item = response.data.items?.[0];
    if (!item) return null;

    const videoData = {
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
      publishedAt: item.snippet.publishedAt
    };

    cache.set(cacheKey, { data: videoData, timestamp: Date.now() });
    return videoData;
  } catch (err) {
    console.error('YouTube Video Details Error:', err.message);
    return {
      videoId,
      title: 'YouTube Music Track',
      description: 'Music track',
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channelTitle: 'MoodHarmonies'
    };
  }
};
