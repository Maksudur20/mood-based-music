import { supabaseAdmin } from '../config/supabase.js';

export const getSystemStats = async (req, res) => {
  try {
    const [usersRes, playlistsRes, favoritesRes, historyRes, searchesRes, moodsRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('playlists').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('favorites').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('listening_history').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('search_history').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('moods').select('id, name')
    ]);

    // Fetch top searched queries
    const { data: topSearches } = await supabaseAdmin
      .from('search_history')
      .select('query')
      .order('searched_at', { ascending: false })
      .limit(10);

    return res.json({
      stats: {
        totalUsers: usersRes.count || 0,
        totalPlaylists: playlistsRes.count || 0,
        totalFavorites: favoritesRes.count || 0,
        totalPlays: historyRes.count || 0,
        totalSearches: searchesRes.count || 0,
        totalMoods: moodsRes.data?.length || 0
      },
      recentSearches: topSearches || []
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return res.json({ message: 'User role updated', user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
