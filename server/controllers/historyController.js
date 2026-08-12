import { supabaseAdmin } from '../config/supabase.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: history, error } = await supabaseAdmin
      .from('listening_history')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return res.json({ history });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { video_id, title, thumbnail_url, channel_title, mood_id } = req.body;

    if (!video_id || !title) {
      return res.status(400).json({ error: 'Video ID and title are required.' });
    }

    const { data: entry, error } = await supabaseAdmin
      .from('listening_history')
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

    if (error) throw error;
    return res.status(201).json({ message: 'History logged', entry });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error } = await supabaseAdmin
      .from('listening_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return res.json({ message: 'Listening history cleared' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
