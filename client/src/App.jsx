import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { PlayerBar } from './components/PlayerBar.jsx';
import { PlaylistModal } from './components/PlaylistModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MoodPage } from './pages/MoodPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { LibraryPage } from './pages/LibraryPage.jsx';
import { PlaylistDetailsPage } from './pages/PlaylistDetailsPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';

export default function App() {
  const [playlistTrackModal, setPlaylistTrackModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="min-h-screen flex flex-col pb-24">
          <Navbar onOpenAuth={() => setShowAuthModal(true)} />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-6">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onOpenPlaylistModal={(track) => setPlaylistTrackModal(track)}
                    onOpenAuth={() => setShowAuthModal(true)}
                  />
                }
              />
              <Route
                path="/moods"
                element={
                  <MoodPage
                    onOpenPlaylistModal={(track) => setPlaylistTrackModal(track)}
                    onOpenAuth={() => setShowAuthModal(true)}
                  />
                }
              />
              <Route
                path="/search"
                element={
                  <SearchPage
                    onOpenPlaylistModal={(track) => setPlaylistTrackModal(track)}
                    onOpenAuth={() => setShowAuthModal(true)}
                  />
                }
              />
              <Route
                path="/library"
                element={
                  <LibraryPage
                    onOpenPlaylistModal={(track) => setPlaylistTrackModal(track)}
                    onOpenAuth={() => setShowAuthModal(true)}
                  />
                }
              />
              <Route path="/playlist/:id" element={<PlaylistDetailsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>

          <PlayerBar />

          {playlistTrackModal && (
            <PlaylistModal
              track={playlistTrackModal}
              onClose={() => setPlaylistTrackModal(null)}
            />
          )}

          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
        </div>
      </PlayerProvider>
    </AuthProvider>
  );
}
