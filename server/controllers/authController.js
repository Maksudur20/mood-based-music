import { supabaseAdmin } from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profile_image } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (name) updates.name = name;
    if (profile_image) updates.profile_image = profile_image;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: 'Profile updated successfully', profile });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
