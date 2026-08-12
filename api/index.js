import express from 'express';
import cors from 'cors';
import authRoutes from '../server/routes/authRoutes.js';
import youtubeRoutes from '../server/routes/youtubeRoutes.js';
import moodRoutes from '../server/routes/moodRoutes.js';
import favoriteRoutes from '../server/routes/favoriteRoutes.js';
import playlistRoutes from '../server/routes/playlistRoutes.js';
import historyRoutes from '../server/routes/historyRoutes.js';
import adminRoutes from '../server/routes/adminRoutes.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Route handlers matching both /api/xxx and /xxx
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/youtube', '/youtube'], youtubeRoutes);
app.use(['/api/moods', '/moods'], moodRoutes);
app.use(['/api/favorites', '/favorites'], favoriteRoutes);
app.use(['/api/playlists', '/playlists'], playlistRoutes);
app.use(['/api/history', '/history'], historyRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

app.get(['/api/health', '/health', '/api', '/'], (req, res) => {
  res.json({ status: 'ok', message: 'MoodHarmonies Backend API running smoothly' });
});

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Fallback Error Handler (Returns 200 to prevent Vercel 500 overlay)
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(200).json({ error: err.message || 'Internal error' });
});

export default app;
