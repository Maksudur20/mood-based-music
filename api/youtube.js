const FALLBACK_TRACKS = [
  {
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    description: 'Relaxing lo-fi beats and ambient chill music.',
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'ZbZSe6N_BXs',
    title: 'Happy - Pharrell Williams (Official Music Video)',
    description: 'Upbeat and feel-good music video.',
    thumbnailUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg',
    channelTitle: 'Pharrell Williams',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: '4xDzrJKXOOY',
    title: 'synthwave radio - chill / retro beats',
    description: 'Retro synthwave and night drive tunes.',
    thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    channelTitle: 'Lofi Girl',
    publishedAt: new Date().toISOString()
  },
  {
    videoId: 'DWcJFNfaw9c',
    title: 'Calm Piano Music 24/7 for Peaceful Relaxation & Sleep',
    description: 'Peaceful piano and acoustic melodies.',
    thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg',
    channelTitle: 'Relaxing Music',
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
