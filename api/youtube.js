const FALLBACK_TRACKS = [
  {
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax / Study to',
    description: 'Relaxing lo-fi beats and ambient chill music.',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/0.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: '5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Sleep / Chill to',
    description: 'Peaceful lo-fi beats for sleeping and unwinding.',
    thumbnailUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/0.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: '4xDzrJKXOOY',
    title: 'Synthwave Radio - Chill & Retro Beats',
    description: 'Retro synthwave and night drive music.',
    thumbnailUrl: 'https://img.youtube.com/vi/4xDzrJKXOOY/0.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'DWcJFNfaw9c',
    title: 'Calm Piano Music - Peaceful Relaxation & Study',
    description: 'Peaceful piano and acoustic ambient melodies.',
    thumbnailUrl: 'https://img.youtube.com/vi/DWcJFNfaw9c/0.jpg',
    channelTitle: 'Relaxing Music',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: '3JZ_D3ELwOQ',
    title: 'Best Ambient Chillout Music Playlist',
    description: 'Soft instrumental background music.',
    thumbnailUrl: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/0.jpg',
    channelTitle: 'Ambient Chill',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'fJ9rUzIMcZQ',
    title: 'Classic Melodic Harmonies Collection',
    description: 'Timeless melodic compositions.',
    thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/0.jpg',
    channelTitle: 'Music Harmonies',
    publishedAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const mood = req.query?.mood || 'Music';
  return res.status(200).json({
    mood,
    count: FALLBACK_TRACKS.length,
    results: FALLBACK_TRACKS
  });
}
