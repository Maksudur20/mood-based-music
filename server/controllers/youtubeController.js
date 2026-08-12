import { searchYouTube, getVideoDetails } from '../services/youtubeService.js';
import { supabaseAdmin } from '../config/supabase.js';

export const searchMusic = async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required.' });
    }

    const results = await searchYouTube(q, limit ? parseInt(limit, 10) : 15);

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
    if (!mood) {
      return res.status(400).json({ error: 'Mood parameter is required.' });
    }

    // Find mood in database
    const { data: moodData } = await supabaseAdmin
      .from('moods')
      .select('id, name, gradient_from, gradient_to')
      .ilike('name', mood)
      .single();

    let queryKeyword = `${mood} music playlist`;

    if (moodData) {
      // Fetch keywords associated with mood
      const { data: keywords } = await supabaseAdmin
        .from('mood_keywords')
        .select('keyword')
        .eq('mood_id', moodData.id);

      if (keywords && keywords.length > 0) {
        // Pick a random keyword from the mood's keyword pool
        const randomKw = keywords[Math.floor(Math.random() * keywords.length)];
        queryKeyword = randomKw.keyword;
      }
    }

    const results = await searchYouTube(queryKeyword, 20);

    return res.json({
      mood: moodData?.name || mood,
      moodId: moodData?.id || null,
      gradient: { from: moodData?.gradient_from, to: moodData?.gradient_to },
      queryKeyword,
      results
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getVideoInfo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await getVideoDetails(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    return res.json({ video });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
