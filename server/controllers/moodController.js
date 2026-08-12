import { supabaseAdmin } from '../config/supabase.js';

export const getMoods = async (req, res) => {
  try {
    const { data: moods, error } = await supabaseAdmin
      .from('moods')
      .select('*, mood_keywords(id, keyword)')
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    return res.json({ moods });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: mood, error } = await supabaseAdmin
      .from('moods')
      .select('*, mood_keywords(id, keyword)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Mood not found' });
    return res.json({ mood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createMood = async (req, res) => {
  try {
    const { name, icon, description, gradient_from, gradient_to, keywords } = req.body;
    if (!name || !icon) {
      return res.status(400).json({ error: 'Name and icon are required.' });
    }

    const { data: mood, error } = await supabaseAdmin
      .from('moods')
      .insert({ name, icon, description, gradient_from, gradient_to })
      .select()
      .single();

    if (error) throw error;

    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      const keywordInserts = keywords.map(kw => ({
        mood_id: mood.id,
        keyword: kw
      }));
      await supabaseAdmin.from('mood_keywords').insert(keywordInserts);
    }

    return res.status(201).json({ message: 'Mood created successfully', mood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addKeywordToMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required.' });
    }

    const { data: newKw, error } = await supabaseAdmin
      .from('mood_keywords')
      .insert({ mood_id: id, keyword })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ message: 'Keyword added successfully', keyword: newKw });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteKeyword = async (req, res) => {
  try {
    const { keywordId } = req.params;
    const { error } = await supabaseAdmin
      .from('mood_keywords')
      .delete()
      .eq('id', keywordId);

    if (error) throw error;
    return res.json({ message: 'Keyword deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
