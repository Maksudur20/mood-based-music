import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const MOOD_TRACKS = {
  happy: [
    { videoId: 'ZbZSe6N_BXs', title: 'Happy - Pharrell Williams (Official Video)', description: 'Feel good upbeat hits', channelTitle: 'Pharrell Williams', thumbnailUrl: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg' },
    { videoId: '09R8_2nJtjg', title: 'Sugar - Maroon 5', description: 'Upbeat pop tunes', channelTitle: 'Maroon 5', thumbnailUrl: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg' },
    { videoId: 'ru0KmrIhBLw', title: 'Can\'t Stop the Feeling! - Justin Timberlake', description: 'Dance & feel good vibe', channelTitle: 'Justin Timberlake', thumbnailUrl: 'https://i.ytimg.com/vi/ru0KmrIhBLw/hqdefault.jpg' },
    { videoId: 'OPf0YbXqDm0', title: 'Uptown Funk - Mark Ronson ft. Bruno Mars', description: 'Funk & upbeat rhythms', channelTitle: 'Mark Ronson', thumbnailUrl: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg' },
    { videoId: 'TUVcZfQe-Kw', title: 'Dua Lipa - Levitating', description: 'Pop dance euphoria', channelTitle: 'Dua Lipa', thumbnailUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg' },
    { videoId: 'nfWlot6h_JM', title: 'Taylor Swift - Shake It Off', description: 'Pop chart topper', channelTitle: 'Taylor Swift', thumbnailUrl: 'https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg' },
    { videoId: 'hT_nvWreIhg', title: 'Counting Stars - OneRepublic', description: 'Upbeat pop acoustic', channelTitle: 'OneRepublic', thumbnailUrl: 'https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg' },
    { videoId: 'd-diB65scQU', title: 'Katy Perry - Roar', description: 'Inspirational pop anthem', channelTitle: 'Katy Perry', thumbnailUrl: 'https://i.ytimg.com/vi/d-diB65scQU/hqdefault.jpg' }
  ],
  chill: [
    { videoId: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio - Beats to Relax/Study to', description: 'Relaxing lo-fi beats and ambient chill music.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg' },
    { videoId: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio - Beats to Sleep/Chill to', description: 'Peaceful lo-fi beats for sleeping and unwinding.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { videoId: '4xDzrJKXOOY', title: 'Synthwave Radio - Chill & Retro Beats', description: 'Retro synthwave and night drive tunes.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg' },
    { videoId: 'DWcJFNfaw9c', title: 'Calm Piano Music - Peaceful Relaxation & Study', description: 'Peaceful piano and acoustic ambient melodies.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { videoId: '3JZ_D3ELwOQ', title: 'Best Ambient Chillout Music Playlist', description: 'Soft instrumental background music.', channelTitle: 'Ambient Chill', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' },
    { videoId: 'fJ9rUzIMcZQ', title: 'Classic Melodic Harmonies Collection', description: 'Timeless melodic compositions.', channelTitle: 'Music Harmonies', thumbnailUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg' }
  ],
  energetic: [
    { videoId: 'btPJPFnesV4', title: 'Eye of the Tiger - Survivor', description: 'Ultimate workout motivation', channelTitle: 'Survivor', thumbnailUrl: 'https://i.ytimg.com/vi/btPJPFnesV4/hqdefault.jpg' },
    { videoId: 'YvkW-M_gL0M', title: 'High Energy Gym Workout Music', description: 'Hard bass workout motivation', channelTitle: 'Fitness Music', thumbnailUrl: 'https://i.ytimg.com/vi/YvkW-M_gL0M/hqdefault.jpg' },
    { videoId: 'K4DyBUG242c', title: 'EDM Party & Workout Hype Anthems', description: 'Festival EDM hype tracks', channelTitle: 'EDM World', thumbnailUrl: 'https://i.ytimg.com/vi/K4DyBUG242c/hqdefault.jpg' },
    { videoId: 'IcrbM1l_BoI', title: 'Avicii - Wake Me Up', description: 'High energy electronic anthem', channelTitle: 'Avicii', thumbnailUrl: 'https://i.ytimg.com/vi/IcrbM1l_BoI/hqdefault.jpg' },
    { videoId: 'VbfpW0pbvaU', title: 'David Guetta - Titanium ft. Sia', description: 'Dance pop power anthem', channelTitle: 'David Guetta', thumbnailUrl: 'https://i.ytimg.com/vi/VbfpW0pbvaU/hqdefault.jpg' }
  ],
  sad: [
    { videoId: 'RBumgq5yVrA', title: 'Passenger - Let Her Go', description: 'Acoustic emotional ballad', channelTitle: 'Passenger', thumbnailUrl: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg' },
    { videoId: 'hLQl3WQQoQ0', title: 'Adele - Someone Like You', description: 'Heartfelt piano ballad', channelTitle: 'Adele', thumbnailUrl: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg' },
    { videoId: 'k4V3Mo61fJM', title: 'Coldplay - Fix You', description: 'Emotional rock ballad', channelTitle: 'Coldplay', thumbnailUrl: 'https://i.ytimg.com/vi/k4V3Mo61fJM/hqdefault.jpg' },
    { videoId: 'zABLecsR5UE', title: 'Lewis Capaldi - Someone You Loved', description: 'Soul-stirring piano acoustic', channelTitle: 'Lewis Capaldi', thumbnailUrl: 'https://i.ytimg.com/vi/zABLecsR5UE/hqdefault.jpg' },
    { videoId: 'pB-5XG-DbAA', title: 'Sam Smith - Stay With Me', description: 'Emotional soul song', channelTitle: 'Sam Smith', thumbnailUrl: 'https://i.ytimg.com/vi/pB-5XG-DbAA/hqdefault.jpg' }
  ],
  focus: [
    { videoId: 'DWcJFNfaw9c', title: 'Deep Focus Instrumental Study Music', description: 'Instrumental piano for maximum concentration.', channelTitle: 'Study Focus', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { videoId: 'jfKfPfyJRdk', title: 'Lofi Study Beats for Deep Work', description: 'Lo-fi beats for reading & programming.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg' },
    { videoId: '3JZ_D3ELwOQ', title: 'Alpha Waves Brainwave Music for Focus', description: 'Binaural beats for mental clarity.', channelTitle: 'Focus Music', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' },
    { videoId: '4xDzrJKXOOY', title: 'Code & Study Ambient Synth', description: 'Background instrumental synthwave.', channelTitle: 'Lofi Girl', thumbnailUrl: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg' }
  ],
  romantic: [
    { videoId: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', description: 'Romantic wedding & love ballad', channelTitle: 'Ed Sheeran', thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg' },
    { videoId: '450p7goxZqg', title: 'John Legend - All of Me', description: 'Piano love ballad', channelTitle: 'John Legend', thumbnailUrl: 'https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg' },
    { videoId: 'rtOvBOTyX00', title: 'Christina Perri - A Thousand Years', description: 'Acoustic romance', channelTitle: 'Christina Perri', thumbnailUrl: 'https://i.ytimg.com/vi/rtOvBOTyX00/hqdefault.jpg' }
  ],
  party: [
    { videoId: 'K4DyBUG242c', title: 'EDM Party Club Anthems Mix', description: 'High energy dance floor bangers', channelTitle: 'EDM World', thumbnailUrl: 'https://i.ytimg.com/vi/K4DyBUG242c/hqdefault.jpg' },
    { videoId: '5dbM_V01dNE', title: 'Daft Punk - Get Lucky', description: 'Disco funk dance hit', channelTitle: 'Daft Punk', thumbnailUrl: 'https://i.ytimg.com/vi/5dbM_V01dNE/hqdefault.jpg' },
    { videoId: 'eVTXPUfcB70', title: 'Calvin Harris - Summer', description: 'Summer dance festival anthem', channelTitle: 'Calvin Harris', thumbnailUrl: 'https://i.ytimg.com/vi/eVTXPUfcB70/hqdefault.jpg' }
  ],
  relaxed: [
    { videoId: '5qap5aO4i9A', title: 'Gentle Sleep & Relaxation Music', description: 'Calming sounds to unwind and sleep.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    { videoId: 'DWcJFNfaw9c', title: 'Acoustic Guitar & Ocean Waves', description: 'Soft soothing acoustic strings.', channelTitle: 'Relaxing Music', thumbnailUrl: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg' },
    { videoId: '3JZ_D3ELwOQ', title: 'Nighttime Ambient Meditation', description: 'Peaceful ambient meditation.', channelTitle: 'Ambient Chill', thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg' }
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlParts = (req.url || '').split('?')[0].split('/');
  const moodFromUrl = urlParts[urlParts.length - 1];
  const queryMood = req.query?.mood || req.query?.q || moodFromUrl || 'chill';
  const targetMood = (queryMood || 'chill').toLowerCase();

  // If YouTube API Key is configured on Vercel, try fetching live YouTube search results!
  if (YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('your_youtube_api_key')) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${targetMood} music playlist`,
          type: 'video',
          videoCategory: '10',
          maxResults: 15,
          key: YOUTUBE_API_KEY
        }
      });
      const items = response.data.items || [];
      if (items.length > 0) {
        const liveResults = items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt
        }));
        return res.status(200).json({ mood: targetMood, count: liveResults.length, results: liveResults });
      }
    } catch (err) {
      console.warn('Live YouTube API query warning, using rich fallback track list:', err.message);
    }
  }

  // Fallback to rich curated tracks for the target mood
  const tracks = MOOD_TRACKS[targetMood] || MOOD_TRACKS.happy || MOOD_TRACKS.chill;
  return res.status(200).json({
    mood: targetMood,
    count: tracks.length,
    results: tracks
  });
}
