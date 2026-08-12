import { supabaseAdmin } from '../config/supabase.js';

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ favorites });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { video_id, title, thumbnail_url, channel_title, mood_id } = req.body;

    if (!video_id || !title) {
      return res.status(400).json({ error: 'Video ID and title are required.' });
    }

    const { data: favorite, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: userId,
        video_id,
        title,
        thumbnail_url,
        channel_title,
        mood_id: mood_id || null
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Song is already in your favorites.' });
      }
      throw error;
    }

    return res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId);

    if (error) throw error;
    return res.json({ message: 'Removed from favorites' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
