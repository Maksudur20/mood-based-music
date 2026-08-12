# 🎵 MoodHarmonies - Setup & Installation Guide for New PC

Welcome to **MoodHarmonies** (Mood-Based Music Recommendation System)! This step-by-step guide will help you install, configure, and run the entire application on **any new computer** from scratch, even if Node.js or environment variables are not yet set up.

---

## 📋 Prerequisites

Before setting up the project, make sure the new PC has the following installed:

1. **Node.js** (v18 or higher recommended):
   - Download and install Node.js from [nodejs.org](https://nodejs.org/).
   - Verify installation in terminal/cmd:
     ```bash
     node -v
     npm -v
     ```

2. **Git**:
   - Download and install Git from [git-scm.com](https://git-scm.com/).
   - Verify installation:
     ```bash
     git --version
     ```

---

## 🚀 Step 1: Clone the Repository

Open Command Prompt / PowerShell or Terminal and clone the repository:

```bash
git clone https://github.com/Maksudur20/mood-based-music.git
cd mood-based-music
```

---

## 📦 Step 2: Install Dependencies

You need to install dependencies for both the **root**, **client**, and **server** directories.

### Option A: Install All in One Command
Run the following command in the project root folder:

```bash
npm install && cd client && npm install && cd ../server && npm install && cd ..
```

### Option B: Step-by-Step Installation

1. **Install Root Dependencies**:
   ```bash
   npm install
   ```

2. **Install Client (Frontend) Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install Server (Backend) Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

---

## ⚙️ Step 3: Configure Environment Variables

The project includes pre-configured `.env` settings, but you should verify both `.env` files.

### 1. Frontend Environment File (`client/.env`)
Create or verify `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://daeyvqdmmatklkfmvjho.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXl2cWRtbWF0a2xrZm12amhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjQ2NDgsImV4cCI6MjEwMjA0MDY0OH0.Fo2m1uazfh0NnfLdNWZ26HMqf9DOuq4mgZX_1LsR8x4
```

### 2. Backend Environment File (`server/.env`)
Create or verify `server/.env`:

```env
PORT=5000
NODE_ENV=development

# Optional: Add YouTube Data API v3 key for live global YouTube search
YOUTUBE_API_KEY=your_youtube_api_key_here

# Supabase Configurations
SUPABASE_URL=https://daeyvqdmmatklkfmvjho.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXl2cWRtbWF0a2xrZm12amhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQ2NDY0OCwiZXhwIjoyMTAyMDQwNjQ4fQ.9y1yO3p4bJp5kM2X8Y5z8Q
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXl2cWRtbWF0a2xrZm12amhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjQ2NDgsImV4cCI6MjEwMjA0MDY0OH0.Fo2m1uazfh0NnfLdNWZ26HMqf9DOuq4mgZX_1LsR8x4
```

> 💡 **Note**: If `YOUTUBE_API_KEY` is not provided, the application automatically uses the built-in curated mood fallback engine, so songs will load seamlessly without errors!

---

## 🏃 Step 4: Run the Application

### Option 1: 1-Click Launch (Windows)
Double-click **`run_local.bat`** in the project root directory!
It will open two command windows:
- **Backend Server**: running on `http://localhost:5000`
- **Frontend Client**: running on `http://localhost:3000`

### Option 2: Manual Command Line Launch

1. **Terminal 1 (Backend Server)**:
   ```bash
   cd server
   npm run dev
   ```

2. **Terminal 2 (Frontend Client)**:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to:
   👉 **`http://localhost:3000`**

---

## 🔧 How to Get a Free YouTube API Key (Optional)

If you want live custom YouTube search for any term:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **MoodHarmonies**.
3. Go to **APIs & Services** > **Library** and search for **YouTube Data API v3**.
4. Click **Enable**.
5. Go to **APIs & Services** > **Credentials** > **Create Credentials** > **API Key**.
6. Copy your generated key and paste it into `server/.env`:
   ```env
   YOUTUBE_API_KEY=AIzaSy...your_key_here
   ```

---

## 🛠️ Troubleshooting

- **Port 5000 or 3000 in use**:
  Kill processes using ports 5000/3000 or change `PORT=5001` in `server/.env` and update `VITE_API_URL` in `client/.env`.
- **Node module errors**:
  Delete `node_modules` and run `npm install` again.

---

🎉 **You are ready! Enjoy streaming music tailored to your mood!** 🎧
