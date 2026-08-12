import { supabaseAdmin } from '../config/supabase.js';

const DEFAULT_MOODS = [
  { id: '1', name: 'Happy', icon: '😊', description: 'Upbeat and cheerful tracks to boost your day', gradient_from: '#f59e0b', gradient_to: '#ef4444' },
  { id: '2', name: 'Chill', icon: '🎧', description: 'Relaxing lo-fi and ambient sounds', gradient_from: '#6366f1', gradient_to: '#a855f7' },
  { id: '3', name: 'Energetic', icon: '⚡', description: 'High-energy workout and hype beats', gradient_from: '#ef4444', gradient_to: '#ec4899' },
  { id: '4', name: 'Sad', icon: '🌧️', description: 'Melancholic and emotional melodies', gradient_from: '#3b82f6', gradient_to: '#6366f1' },
  { id: '5', name: 'Focus', icon: '🎯', description: 'Instrumental music for study and deep focus', gradient_from: '#10b981', gradient_to: '#06b6d4' },
  { id: '6', name: 'Romantic', icon: '💖', description: 'Love songs and soft acoustics', gradient_from: '#ec4899', gradient_to: '#f43f5e' },
  { id: '7', name: 'Party', icon: '🎉', description: 'Dance, EDM and club anthems', gradient_from: '#8b5cf6', gradient_to: '#d946ef' },
  { id: '8', name: 'Relaxed', icon: '🌙', description: 'Calming sounds to unwind and sleep', gradient_from: '#0284c7', gradient_to: '#6366f1' }
];

export const getMoods = async (req, res) => {
  try {
    let moods = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('moods')
        .select('*');
      if (!error && data && data.length > 0) {
        moods = data;
      }
    } catch (e) {
      console.warn('Supabase fetch moods warning:', e?.message);
    }

    if (!moods || moods.length === 0) {
      return res.json({ moods: DEFAULT_MOODS });
    }

    return res.json({ moods });
  } catch (err) {
    console.error('getMoods outer error:', err);
    return res.json({ moods: DEFAULT_MOODS });
  }
};

export const getMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    let mood = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('moods')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) mood = data;
    } catch (e) {
      console.warn('getMoodById warning:', e?.message);
    }

    if (!mood) {
      const fallbackMood = DEFAULT_MOODS.find(m => m.id === id || m.name.toLowerCase() === id.toLowerCase());
      if (fallbackMood) return res.json({ mood: fallbackMood });
      return res.status(404).json({ error: 'Mood not found' });
    }

    return res.json({ mood });
  } catch (err) {
    return res.json({ mood: DEFAULT_MOODS[0] });
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

export const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, gradient_from, gradient_to, status } = req.body;

    const { data: mood, error } = await supabaseAdmin
      .from('moods')
      .update({ name, icon, description, gradient_from, gradient_to, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ message: 'Mood updated successfully', mood });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('moods').delete().eq('id', id);

    if (error) throw error;
    return res.json({ message: 'Mood deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
