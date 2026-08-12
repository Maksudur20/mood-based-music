import { searchYouTube, getVideoDetails } from '../services/youtubeService.js';
import { supabaseAdmin } from '../config/supabase.js';

export const searchMusic = async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required.' });
    }

    const results = await searchYouTube(q, limit ? parseInt(limit, 10) : 20);

    // Save search history if user is authenticated
    if (req.user) {
      await supabaseAdmin.from('search_history').insert({
        user_id: req.user.id,
        query: q
      });
    }

    return res.json({ query: q, count: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMoodRecommendations = async (req, res) => {
  try {
    const { mood } = req.params;
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;

    if (!mood) {
      return res.status(400).json({ error: 'Mood parameter is required.' });
    }

    // Varied search terms per page for infinite scroll load
    const SEARCH_VARIATIONS = [
      `${mood} music playlist 2026`,
      `${mood} top hits & songs`,
      `${mood} viral music mix`,
      `${mood} acoustic & live session`,
      `${mood} remix & extended playlist`,
      `${mood} mood vibes radio`
    ];

    const currentQuery = SEARCH_VARIATIONS[(page - 1) % SEARCH_VARIATIONS.length];

    const results = await searchYouTube(currentQuery, 15);

    return res.json({
      mood,
      page,
      count: results.length,
      results
    });
  } catch (err) {
    console.error('getMoodRecommendations error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const getVideoInfo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required.' });
    }
    const video = await getVideoDetails(videoId);
    return res.json({ video });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
