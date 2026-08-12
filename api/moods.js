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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({ moods: DEFAULT_MOODS });
}
