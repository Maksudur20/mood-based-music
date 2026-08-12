import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Route normalization for Vercel Serverless Function requests
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mood-Based Music Recommendation API running smoothly',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (req.url && req.url.includes('moods')) {
    return res.json({ moods: [
      { id: '1', name: 'Happy', icon: '😊', description: 'Upbeat and cheerful tracks', gradient_from: '#f59e0b', gradient_to: '#ef4444' },
      { id: '2', name: 'Chill', icon: '🎧', description: 'Relaxing lo-fi and ambient sounds', gradient_from: '#6366f1', gradient_to: '#a855f7' },
      { id: '3', name: 'Energetic', icon: '⚡', description: 'High-energy workout beats', gradient_from: '#ef4444', gradient_to: '#ec4899' },
      { id: '4', name: 'Sad', icon: '🌧️', description: 'Melancholic and emotional melodies', gradient_from: '#3b82f6', gradient_to: '#6366f1' }
    ] });
  }
  return res.status(200).json({ error: err.message || 'Internal Server Error', results: [] });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  });
}

export default app;
