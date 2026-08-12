import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Simple in-memory cache to save API quota points
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache

export const searchYouTube = async (query, maxResults = 15) => {
  if (!query) return [];

  const cacheKey = `search:${query.trim().toLowerCase()}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes('your_youtube_api_key')) {
    console.warn('⚠️ Invalid or missing YOUTUBE_API_KEY!');
    throw new Error('YouTube API Key is missing or invalid.');
  }

  try {
    const response = await axios.get(`${YOUTUBE_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: `${query} music`,
        type: 'video',
        videoCategory: '10', // 10 is Music category in YouTube API
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

    cache.set(cacheKey, { data: formattedVideos, timestamp: Date.now() });
    return formattedVideos;
  } catch (err) {
    const apiError = err.response?.data?.error?.message || err.message;
    console.error('YouTube API Error:', apiError);

    // If quota exceeded or error, fallback gracefully
    if (err.response?.status === 403) {
      throw new Error('YouTube API quota limit reached. Please try again later.');
    }
    throw new Error(`YouTube Search Error: ${apiError}`);
  }
};

export const getVideoDetails = async (videoId) => {
  if (!videoId) return null;

  const cacheKey = `video:${videoId}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
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
    return null;
  }
};
