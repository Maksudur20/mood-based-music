# Mood-Based Music Recommendation System

## Software Requirements Specification (SRS)

### Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js |
| API Framework | Express.js |
| Database | Supabase PostgreSQL |
| External API | YouTube Data API v3 |
| Authentication | Supabase Auth / JWT |
| Music Player | YouTube Embedded Player |
| Styling | Tailwind CSS |
| Version Control | Git & GitHub |
| Deployment | Vercel + Render/Railway |

---

# 1. Introduction

## 1.1 Project Title

**Mood-Based Music Recommendation System**

## 1.2 Project Overview

The Mood-Based Music Recommendation System is a web-based music discovery and recommendation platform designed to recommend music according to the user's current mood.

The system will use the **YouTube Data API v3** to search and retrieve music-related videos from YouTube. The application itself will not store or host the actual audio/video files.

Users can select a mood such as Happy, Sad, Relaxed, Energetic, Romantic, Focused, Motivational, or Sleepy. Based on the selected mood, the system will generate appropriate search queries and retrieve relevant music from YouTube.

The application will use **Supabase PostgreSQL** as its primary database for storing users, moods, playlists, favorites, listening history, preferences, and other application-related information.

The application will use a YouTube Embedded Player to play selected content.

---

# 2. Problem Statement

Most music discovery systems primarily recommend content based on previous listening behavior, genre, popularity, or artist preferences.

However, users often want music based on their current emotional state.

For example:

- A happy user may want upbeat music.
- A sad user may want emotional music.
- A student may want focus music.
- A user who wants to relax may prefer calm music.
- A user exercising may prefer energetic music.

Therefore, this system aims to provide a simple mood-based music discovery experience where users can select their mood and receive relevant YouTube music recommendations.

---

# 3. Project Objectives

The main objectives are:

1. Develop a modern web-based music recommendation system.
2. Recommend music based on user mood.
3. Integrate YouTube Data API v3.
4. Use Supabase PostgreSQL for application data.
5. Provide user authentication.
6. Provide mood-based music search.
7. Provide an embedded YouTube music player.
8. Allow users to create playlists.
9. Allow users to save favorite music.
10. Maintain listening/watch history.
11. Provide personalized recommendations.
12. Provide an administrator dashboard.
13. Provide a responsive user interface.
14. Design the system for future AI-based mood detection.

---

# 4. System Scope

The system will consist of two major areas:

## 4.1 User System

Users can:

- Register
- Login
- Logout
- Select mood
- Browse recommendations
- Search music
- Play YouTube videos
- Pause/play music
- Save favorites
- Create playlists
- Edit playlists
- Delete playlists
- Add/remove songs from playlists
- View listening history
- Manage profile
- Receive personalized recommendations

## 4.2 Admin System

Administrators can:

- Access admin dashboard
- Manage users
- Manage moods
- Manage mood keywords
- View system statistics
- Monitor API-related errors
- Manage application settings

---

# 5. Target Users

## 5.1 Normal User

A normal user uses the application to discover and listen to music according to mood.

## 5.2 Administrator

An administrator manages application data and monitors system operations.

---

# 6. User Requirements

## UR-01: User Registration

The system shall allow users to create an account.

Registration information may include:

- Name
- Email
- Password
- Profile image

---

## UR-02: User Login

Users shall be able to log in securely using their registered credentials.

---

## UR-03: Mood Selection

Users shall be able to select their current mood.

Example moods:

- 😊 Happy
- 😢 Sad
- 😌 Relaxed
- ⚡ Energetic
- ❤️ Romantic
- 🎯 Focused
- 🔥 Motivational
- 😴 Sleepy
- 🎉 Party
- 🕰️ Nostalgic

---

## UR-04: Mood-Based Recommendations

After selecting a mood, the system shall provide appropriate YouTube music recommendations.

Example:

```text
User selects: Happy

        ↓

Mood keywords:

happy songs
upbeat music
feel good songs
positive music

        ↓

YouTube Data API

        ↓

Recommended Music
```

---

## UR-05: Music Search

Users shall be able to search for:

- Song titles
- Artists
- Genres
- Albums
- General music keywords

---

## UR-06: Music Playback

Users shall be able to play selected YouTube content through the embedded YouTube player.

---

## UR-07: Favorite Music

Users shall be able to save music to their favorites.

---

## UR-08: Playlist Management

Users shall be able to:

- Create playlists
- Rename playlists
- Delete playlists
- Add music
- Remove music
- Play playlist content

---

## UR-09: Listening History

The system shall record the user's recently played content.

---

## UR-10: User Profile

Users shall be able to manage:

- Name
- Profile picture
- Account information
- Password

---

# 7. System Requirements

## 7.1 Hardware Requirements

Recommended development system:

- Intel Core i5 / AMD Ryzen 5 or higher
- 8 GB RAM minimum
- 10 GB+ available storage
- Stable internet connection
- Modern web browser

Because the actual music/video content is hosted on YouTube, the application does not require large local storage for music files.

---

# 8. Software Requirements

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth
- JWT-based authentication mechanism

## External API

- YouTube Data API v3

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- npm

---

# 9. Technology Architecture

The system will follow this architecture:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │  React.js   │
                    │  Frontend   │
                    └──────┬──────┘
                           │
                         REST
                           │
                           ▼
                  ┌─────────────────┐
                  │ Node.js/Express │
                  │    Backend      │
                  └───────┬─────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      ┌──────────────┐         ┌─────────────────┐
      │   Supabase   │         │  YouTube Data   │
      │  PostgreSQL  │         │      API        │
      └──────────────┘         └────────┬────────┘
                                        │
                                        ▼
                                  YouTube Content
```

---

# 10. Role of Supabase

Supabase will be the application's primary database and authentication platform.

It will store:

- User profiles
- Moods
- Mood keywords
- Favorites
- Playlists
- Playlist songs
- Listening history
- Search history
- User preferences
- Recommendation data

The actual YouTube videos will **not** be stored in Supabase.

Instead, the database will store the YouTube `video_id` and necessary metadata.

---

# 11. Role of YouTube Data API

YouTube Data API will be responsible for retrieving YouTube content.

The system can request:

- Video search results
- Video IDs
- Titles
- Thumbnails
- Channel information
- Published dates
- Other permitted metadata

Example flow:

```text
Mood
 ↓
Search Query
 ↓
Backend
 ↓
YouTube Data API
 ↓
YouTube Results
 ↓
Frontend
```

---

# 12. Mood Recommendation System

The initial recommendation system will use a rule-based approach.

Each mood will have predefined search keywords.

| Mood | Example Keywords |
|---|---|
| Happy | happy songs, upbeat music, feel good music |
| Sad | sad songs, emotional songs, heartbreak songs |
| Relaxed | relaxing music, calm music, chill music |
| Energetic | energetic music, workout music, EDM |
| Romantic | romantic songs, love songs |
| Focused | focus music, study music, instrumental |
| Motivational | motivational songs, inspirational music |
| Sleepy | sleep music, peaceful music |
| Party | party music, dance music |
| Nostalgic | nostalgic songs, old songs |

---

# 13. Recommendation Process

```text
User selects mood
        ↓
Backend receives mood
        ↓
Find mood keywords from Supabase
        ↓
Generate search query
        ↓
Call YouTube Data API
        ↓
Receive search results
        ↓
Process/filter results
        ↓
Return results
        ↓
Display recommendations
```

---

# 14. Personalized Recommendation

A future version can improve recommendations using user behavior.

The system can consider:

```text
Current Mood
     +
Favorite Music
     +
Listening History
     +
Search History
     +
Preferred Genres
     +
Frequently Played Artists
     ↓
Recommendation Score
     ↓
Personalized Recommendations
```

---

# 15. Functional Requirements

## FR-01: Authentication

The system shall provide secure user registration and login.

## FR-02: Mood Selection

The system shall allow users to select a mood.

## FR-03: Mood Recommendation

The system shall generate music recommendations based on the selected mood.

## FR-04: YouTube Search

The backend shall search YouTube using the YouTube Data API.

## FR-05: Search Results

The system shall display available video information such as:

- Thumbnail
- Title
- Channel
- Video ID
- Published information where available

## FR-06: Music Playback

The system shall allow users to play selected content using the YouTube Embedded Player.

## FR-07: Favorites

The system shall allow users to save and remove favorite content.

## FR-08: Playlist

The system shall allow users to create and manage playlists.

## FR-09: History

The system shall maintain user listening/watch history.

## FR-10: Personalized Recommendation

The system may use stored user behavior to improve future recommendations.

## FR-11: Admin Management

The administrator shall be able to manage application users, moods, keywords, and system settings.

---

# 16. Non-Functional Requirements

## 16.1 Performance

The system should:

- Load pages quickly.
- Minimize unnecessary API requests.
- Provide fast search responses.
- Provide smooth UI navigation.
- Handle multiple users efficiently.

---

## 16.2 Security

The system shall:

- Secure user authentication.
- Hash passwords where application-managed credentials are used.
- Protect private API routes.
- Use Row Level Security in Supabase.
- Validate user input.
- Protect API credentials.
- Implement role-based authorization.

---

## 16.3 Usability

The interface should be:

- Simple
- Modern
- Responsive
- Mobile-friendly
- Easy to understand

---

## 16.4 Reliability

The system shall properly handle:

- YouTube API errors
- Network errors
- Invalid searches
- Empty results
- Authentication errors
- Missing YouTube videos
- API quota limitations

---

## 16.5 Scalability

The architecture should support future:

- AI mood detection
- Machine learning
- Mobile applications
- Voice-based search
- Advanced analytics
- Social features

---

# 17. Supabase Database Design

The proposed database will contain the following tables:

```text
profiles
moods
mood_keywords
favorites
playlists
playlist_songs
listening_history
search_history
user_preferences
```

---

# 18. Profiles Table

The `profiles` table will store application-specific user information.

```text
profiles
────────────────────────
id
name
email
profile_image
role
created_at
updated_at
```

The `id` can be associated with the authenticated Supabase user.

---

# 19. Moods Table

```text
moods
────────────────────────
id
name
icon
description
status
created_at
updated_at
```

Example:

```text
1 | Happy | 😊 | Positive and cheerful mood | active
2 | Sad | 😢 | Emotional and calm mood | active
3 | Relaxed | 😌 | Calm and peaceful mood | active
```

---

# 20. Mood Keywords Table

This table stores search keywords associated with each mood.

```text
mood_keywords
────────────────────────
id
mood_id
keyword
created_at
```

Example:

```text
Happy → happy songs
Happy → upbeat music
Happy → feel good music
```

---

# 21. Favorites Table

```text
favorites
────────────────────────
id
user_id
video_id
title
thumbnail_url
channel_title
mood_id
created_at
```

The system stores the YouTube `video_id` instead of storing the actual video.

---

# 22. Playlists Table

```text
playlists
────────────────────────
id
user_id
name
description
cover_image
created_at
updated_at
```

---

# 23. Playlist Songs Table

This table creates a relationship between playlists and YouTube videos.

```text
playlist_songs
────────────────────────
id
playlist_id
video_id
title
thumbnail_url
channel_title
position
added_at
```

---

# 24. Listening History Table

```text
listening_history
────────────────────────
id
user_id
video_id
title
thumbnail_url
channel_title
mood_id
played_at
```

---

# 25. Search History Table

```text
search_history
────────────────────────
id
user_id
query
mood_id
searched_at
```

This can later help improve personalized recommendations.

---

# 26. User Preferences Table

```text
user_preferences
────────────────────────
id
user_id
preferred_moods
preferred_genres
preferred_artists
updated_at
```

This table is optional for the first version but useful for personalized recommendations.

---

# 27. Database Relationships

```text
                 profiles
                    │
           ┌────────┼─────────┐
           │        │         │
           ▼        ▼         ▼
      favorites  playlists  history
                   │
                   ▼
             playlist_songs

moods
  │
  └────── mood_keywords
```

More specifically:

```text
profiles 1 ───── N favorites

profiles 1 ───── N playlists

playlists 1 ──── N playlist_songs

profiles 1 ───── N listening_history

profiles 1 ───── N search_history

moods 1 ───────── N mood_keywords

moods 1 ───────── N listening_history
```

---

# 28. YouTube API Architecture

The YouTube API key should remain on the backend.

```text
React
  │
  │ Search Request
  ▼
Express Backend
  │
  │ API Key
  ▼
YouTube Data API
  │
  ▼
Search Results
  │
  ▼
Express
  │
  ▼
React
```

The API key should not be hard-coded in React source code.

---

# 29. Environment Variables

Backend `.env` example:

```text
PORT=5000

SUPABASE_URL=your_supabase_url

SUPABASE_SERVICE_ROLE_KEY=your_server_side_key

YOUTUBE_API_KEY=your_youtube_api_key

JWT_SECRET=your_secret
```

The actual credentials must never be committed to GitHub.

---

# 30. Backend API Requirements

## Authentication

If Supabase Auth is used:

```text
POST /api/auth/profile
GET  /api/auth/me
```

Authentication itself can be handled by Supabase Auth.

---

## YouTube

```text
GET /api/youtube/search?q=
GET /api/youtube/mood/:mood
GET /api/youtube/video/:videoId
```

---

## Moods

```text
GET    /api/moods
GET    /api/moods/:id
POST   /api/moods
PUT    /api/moods/:id
DELETE /api/moods/:id
```

Admin-only operations should be protected.

---

## Favorites

```text
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:videoId
```

---

## Playlists

```text
GET    /api/playlists
POST   /api/playlists
GET    /api/playlists/:id
PUT    /api/playlists/:id
DELETE /api/playlists/:id

POST   /api/playlists/:id/songs
DELETE /api/playlists/:id/songs/:videoId
```

---

## History

```text
GET    /api/history
POST   /api/history
DELETE /api/history/:id
DELETE /api/history
```

---

# 31. Frontend Pages

## 31.1 Home Page

The home page will display:

```text
Welcome Back!

How are you feeling?

😊 Happy
😢 Sad
😌 Relaxed
⚡ Energetic
❤️ Romantic
🎯 Focused
🔥 Motivational

Recommended For You
────────────────────

[Music Card]
[Music Card]
[Music Card]
```

---

# 32. Mood Page

The mood page will allow users to select a mood.

Example:

```text
How are you feeling today?

😊
Happy

😢
Sad

😌
Relaxed

⚡
Energetic

❤️
Romantic

🎯
Focused
```

After selection, the system will retrieve recommendations.

---

# 33. Search Page

```text
Search Music

[________________________] 🔍

Recent Searches

Search Results

┌─────────────────────────┐
│ Thumbnail               │
│ Song Title              │
│ Channel                 │
│                         │
│ ▶ Play    ♡ Favorite   │
└─────────────────────────┘
```

---

# 34. Music Player

The system will use a YouTube Embedded Player.

The interface may contain:

- Video/song title
- Artist/channel
- Play/pause
- Seek
- Volume
- Fullscreen
- Next/previous controls implemented by the application where appropriate
- Favorite button
- Add to playlist

---

# 35. Library Page

```text
My Library

├── Favorites
├── My Playlists
├── Recently Played
└── Recommended
```

---

# 36. Playlist Page

Each playlist will display:

```text
Playlist Name
Description

Song 1
Song 2
Song 3
Song 4

[Play All]
```

Users can add or remove YouTube videos.

---

# 37. Profile Page

The profile page may contain:

```text
Profile Picture

Name
Email

Favorite Mood
Favorite Genres

Recently Played
Listening Statistics
```

---

# 38. Admin Dashboard

The admin dashboard may display:

```text
ADMIN DASHBOARD

Total Users
Total Playlists
Total Favorites
Total Searches

Popular Mood
Most Searched Query
Most Played Video

API Errors
System Status
```

---

# 39. Admin Functions

## User Management

Admin can:

- View users
- Search users
- View account information
- Disable accounts where required

## Mood Management

Admin can:

- Add moods
- Edit moods
- Deactivate moods
- Add keywords
- Edit keywords
- Remove keywords

## System Monitoring

Admin can monitor:

- User activity statistics
- Popular moods
- Popular searches
- API errors
- Application usage

---

# 40. Supabase Row Level Security

Supabase Row Level Security (RLS) should be enabled for user-specific tables.

For example:

A user should only be able to access their own:

```text
favorites
playlists
listening_history
search_history
preferences
```

Conceptually:

```text
User A
   ↓
Can access User A's data

User B
   ↓
Can access User B's data

User A
   ✕
Cannot access User B's private data
```

Admin privileges should be handled through secure server-side authorization and appropriate database policies.

---

# 41. Security Requirements

The system should implement:

### Authentication

- Supabase Auth
- Secure sessions/tokens
- Protected routes

### Database

- Row Level Security
- Proper database policies
- Input validation

### API

- Backend-only YouTube API key
- Request validation
- Rate limiting where appropriate
- Error handling

### Source Code

Sensitive information must not be stored in:

```text
React source code
GitHub repository
Public configuration files
```

---

# 42. YouTube API Quota Management

The YouTube Data API uses quota-based access.

Therefore, the system should minimize unnecessary API requests.

Recommended strategies:

1. Avoid duplicate searches.
2. Cache appropriate search results.
3. Store selected video metadata in Supabase.
4. Avoid requesting unnecessary API fields.
5. Validate user queries before API calls.
6. Handle quota-exceeded errors.
7. Implement reasonable request limits.

Example:

```text
User searches:
"Taylor Swift"

        ↓

YouTube API Request

        ↓

Store useful metadata/cache

        ↓

Repeated request
        ↓
Use cached data where appropriate
```

---

# 43. Error Handling

## YouTube API Error

```text
Unable to load music.
Please try again later.
```

## No Search Result

```text
No music found for your search.
```

## Invalid Mood

```text
This mood is currently unavailable.
```

## Authentication Error

```text
Please login to continue.
```

## API Quota Error

```text
Music search is temporarily unavailable.
Please try again later.
```

---

# 44. Recommended Project Structure

```text
mood-music-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   │   └── youtubeService.js
│   ├── config/
│   ├── utils/
│   ├── .env
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# 45. Main Use Cases

## User Use Cases

```text
                    ┌─────────────┐
                    │    USER     │
                    └──────┬──────┘
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
    Register           Select Mood           Search
       │                   │                    │
     Login          Get Recommendations         │
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                      Play Music
                           │
              ┌────────────┼────────────┐
              │            │            │
           Favorite     Playlist      History
```

---

# 46. Admin Use Cases

```text
                    ┌─────────────┐
                    │    ADMIN    │
                    └──────┬──────┘
                           │
            ┌──────────────┼───────────────┐
            │              │               │
       Manage Users   Manage Moods   Manage Keywords
            │              │               │
            └──────────────┼───────────────┘
                           │
                    View Statistics
                           │
                    Monitor System
```

---

# 47. Development Phases

## Phase 1 — Project Setup

- React setup
- Express setup
- Supabase project
- Database setup
- GitHub repository
- Environment variables

## Phase 2 — Authentication

- Supabase Auth
- Registration
- Login
- Logout
- Protected routes
- User profile

## Phase 3 — YouTube Integration

- Google Cloud project
- Enable YouTube Data API
- Create API credentials
- Backend YouTube service
- Search endpoint
- Search results UI
- Embedded player

## Phase 4 — Mood System

- Create mood tables
- Create mood keywords
- Mood selection UI
- Mood-based search
- Recommendation page

## Phase 5 — User Features

- Favorites
- Playlists
- Playlist songs
- Listening history
- Search history
- User preferences

## Phase 6 — Personalized Recommendation

- Analyze user history
- Analyze favorite content
- Analyze selected moods
- Generate recommendation score

## Phase 7 — Admin Dashboard

- User management
- Mood management
- Keyword management
- Statistics
- System monitoring

## Phase 8 — Testing

- Unit testing
- API testing
- Database testing
- Authentication testing
- UI testing
- Responsive testing

## Phase 9 — Deployment

```text
React
  ↓
Vercel

Express/Node.js
  ↓
Render / Railway / VPS

Supabase
  ↓
PostgreSQL + Auth

YouTube
  ↓
YouTube Data API
```

---

# 48. Testing Requirements

## Authentication Testing

Test:

- Registration
- Duplicate email
- Login
- Incorrect password
- Logout
- Protected routes

## Mood Testing

Test:

- Mood selection
- Valid mood
- Invalid mood
- Empty recommendations

## YouTube Testing

Test:

- Search
- Empty search
- No results
- API failure
- API quota limitation
- Video unavailable

## Playlist Testing

Test:

- Create playlist
- Rename playlist
- Delete playlist
- Add video
- Remove video

## Favorites Testing

Test:

- Add favorite
- Remove favorite
- Duplicate prevention

## Database Testing

Test:

- RLS policies
- User ownership
- Data insertion
- Data deletion
- Data relationships

---

# 49. Future Scope

The system can later be upgraded with advanced technologies.

## 49.1 AI Mood Detection

```text
Camera
   ↓
Face Detection
   ↓
Emotion Recognition
   ↓
Detected Mood
   ↓
YouTube Recommendation
```

## 49.2 Text Mood Detection

Users can enter text describing how they feel.

Example:

```text
"I had a stressful day."
```

A sentiment analysis model could determine an appropriate mood and recommend music.

## 49.3 Voice-Based Mood Detection

A future version could analyze voice characteristics and recommend suitable music.

## 49.4 Machine Learning Recommendation

The system could learn from:

- Listening history
- Favorites
- Search history
- Selected moods
- Playlists
- Skipped content

and generate personalized recommendations.

---

# 50. Limitations

The initial system has several limitations:

1. An internet connection is required.
2. Recommendations depend on YouTube search results.
3. YouTube API quota limitations apply.
4. Some videos may become unavailable.
5. Search results may contain non-music content.
6. The initial recommendation system is rule-based.
7. The system does not directly host or store music files.
8. YouTube content availability and playback are controlled by YouTube.

---

# 51. Expected User Flow

```text
                Open Website
                     │
                     ▼
                 Login/Register
                     │
                     ▼
                 Home Page
                     │
                     ▼
               Select Mood
                     │
                     ▼
          Mood-Based Recommendations
                     │
                     ▼
              Select Music
                     │
                     ▼
              YouTube Player
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Favorite   Playlist    History
                     │
                     ▼
              Personalized Data
                     │
                     ▼
          Future Recommendations
```

---

# 52. Final System Architecture

```text
                         MOOD MUSIC SYSTEM
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
          FRONTEND                              BACKEND
          React.js                           Node + Express
             │                                     │
             │                              ┌──────┴──────┐
             │                              │             │
             │                              ▼             ▼
             │                         Supabase      YouTube API
             │                         PostgreSQL         │
             │                              │             │
             │                              ▼             ▼
             │                         User Data      YouTube
             │                         Playlists      Music
             │                         Favorites      Videos
             │                         History
             │
             ▼
       YouTube Embedded Player
```

---

# 53. Final Technology Stack

The final project technology stack is:

```text
Frontend:
React.js
Tailwind CSS

Backend:
Node.js
Express.js

Database:
Supabase PostgreSQL

Authentication:
Supabase Auth

External API:
YouTube Data API v3

Music Playback:
YouTube Embedded Player

Version Control:
Git + GitHub

Deployment:
Vercel + Render/Railway

Future AI:
Machine Learning / Emotion Detection
```

---

# 54. Conclusion

The **Mood-Based Music Recommendation System** is a modern web-based application that combines mood-based recommendation with YouTube music discovery.

The system uses **React.js** for the frontend, **Node.js and Express.js** for the backend, and **Supabase PostgreSQL** for storing application data. The **YouTube Data API v3** is used as the external source for discovering music content, while the YouTube Embedded Player is used for playback.

Supabase will manage users, profiles, moods, playlists, favorites, listening history, search history, and user preferences. YouTube will remain responsible for hosting and delivering the actual video/music content.

The initial recommendation engine will use predefined mood keywords and YouTube search. In future versions, the system can be extended with AI-based mood detection, machine learning, sentiment analysis, and advanced personalized recommendation algorithms.

Therefore, the proposed system provides a practical, scalable, and modern architecture for building a mood-based music discovery platform without requiring the application to store or host music files directly.