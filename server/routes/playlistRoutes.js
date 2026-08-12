import express from 'express';
import {
  getPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getPlaylists);
router.post('/', createPlaylist);
router.get('/:id', getPlaylistById);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

router.post('/:id/songs', addSongToPlaylist);
router.delete('/:id/songs/:videoId', removeSongFromPlaylist);

export default router;
