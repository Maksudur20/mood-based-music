import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Simple in-memory cache to save API quota points
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

const FALLBACK_TRACKS = [
  {
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    description: 'Relaxing lo-fi beats and ambient chill music.',
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'ZbZSe6N_BXs',
    title: 'Happy - Pharrell Williams (Official Music Video)',
    description: 'Upbeat and feel-good music video.',
    thumbnailUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg',
    channelTitle: 'Pharrell Williams',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: '4xDzrJKXOOY',
    title: 'synthwave radio - chill / retro beats',
    description: 'Retro synthwave and night drive tunes.',
    thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'DWcJFNfaw9c',
    title: 'Calm Piano Music 24/7 for Peaceful Relaxation & Sleep',
    description: 'Peaceful piano and acoustic melodies.',
    thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg',
    channelTitle: 'Relaxing Music',
    publishedAt: new Date().toISOString()
  }
];

export const searchYouTube = async (query, maxResults = 15) => {
  if (!query) return FALLBACK_TRACKS;

  const cacheKey = `search:${query.trim().toLowerCase()}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes('your_youtube_api_key')) {
    console.warn('⚠️ YOUTUBE_API_KEY is not configured. Returning fallback curated tracks.');
    return FALLBACK_TRACKS;
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

    if (formattedVideos.length === 0) return FALLBACK_TRACKS;

    cache.set(cacheKey, { data: formattedVideos, timestamp: Date.now() });
    return formattedVideos;
  } catch (err) {
    console.warn('YouTube API Error or Quota limit, serving fallback music tracks:', err.message);
    return FALLBACK_TRACKS;
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
