import { supabaseAdmin } from '../config/supabase.js';

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: playlists, error } = await supabaseAdmin
      .from('playlists')
      .select('*, playlist_songs(id, video_id, title, thumbnail_url, channel_title, added_at)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return res.json({ playlists });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, cover_image } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required.' });
    }

    const { data: playlist, error } = await supabaseAdmin
      .from('playlists')
      .insert({
        user_id: userId,
        name,
        description,
        cover_image: cover_image || undefined
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ message: 'Playlist created', playlist });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: playlist, error } = await supabaseAdmin
      .from('playlists')
      .select('*, playlist_songs(*)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Playlist not found.' });
    return res.json({ playlist });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, cover_image } = req.body;

    const { data: playlist, error } = await supabaseAdmin
      .from('playlists')
      .update({ name, description, cover_image, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return res.json({ message: 'Playlist updated', playlist });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('playlists')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return res.json({ message: 'Playlist deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { video_id, title, thumbnail_url, channel_title } = req.body;

    // Verify ownership
    const { data: playlist } = await supabaseAdmin
      .from('playlists')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!playlist) {
      return res.status(403).json({ error: 'Playlist not found or permission denied.' });
    }

    const { data: song, error } = await supabaseAdmin
      .from('playlist_songs')
      .insert({
        playlist_id: id,
        video_id,
        title,
        thumbnail_url,
        channel_title
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Song already in playlist.' });
      }
      throw error;
    }

    return res.status(201).json({ message: 'Song added to playlist', song });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, videoId } = req.params;

    const { data: playlist } = await supabaseAdmin
      .from('playlists')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!playlist) {
      return res.status(403).json({ error: 'Playlist not found or permission denied.' });
    }

    const { error } = await supabaseAdmin
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', id)
      .eq('video_id', videoId);

    if (error) throw error;
    return res.json({ message: 'Song removed from playlist' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
