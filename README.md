# 🎵 MoodHarmonies - AI Mood-Based Music Recommendation System

A modern full-stack web application that curates, streams, and manages music recommendations based on your current emotional state.

---

## ✨ Features

- 🎧 **8 Mood Categories**: Happy, Chill, Energetic, Sad, Focus, Romantic, Party, and Relaxed.
- 📜 **Infinite Scrolling**: Automatically loads more music tracks as you scroll down.
- 🎬 **YouTube Music Player Bar**: Embedded YouTube player with play/pause, seek, volume control, and continuous track queues.
- 💾 **Local & Supabase Auth & Storage**: Save your favorite songs, create custom playlists, and view play history.
- 📱 **Responsive Dark Glassmorphism UI**: High-end aesthetic styling with dynamic glows and micro-animations.

---

## 🚀 Quick Setup for New PC

Follow the step-by-step setup guide in [**SETUP.md**](file:///d:/Mood-Based%20Music/SETUP.md):

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Maksudur20/mood-based-music.git
   cd mood-based-music
   ```

2. **Install dependencies**:
   ```bash
   npm install && cd client && npm install && cd ../server && npm install && cd ..
   ```

3. **Run 1-Click Launcher**:
   - Double-click **`run_local.bat`** or run:
     ```bash
     cd server && npm run dev
     cd client && npm run dev
     ```

4. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

## 📖 Complete Setup Documentation

For detailed instructions on API keys, environment variables, and troubleshooting, read [**SETUP.md**](file:///d:/Mood-Based%20Music/SETUP.md).

cd client
>> npm.cmd run dev

cd server
>> npm.cmd run dev

taskkill /IM node.exe /F