-- ========================================================
-- MOOD-BASED MUSIC RECOMMENDATION SYSTEM - DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 2. MOODS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.moods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    description TEXT,
    gradient_from VARCHAR(50) DEFAULT '#6366f1',
    gradient_to VARCHAR(50) DEFAULT '#a855f7',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 3. MOOD KEYWORDS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mood_id UUID NOT NULL REFERENCES public.moods(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 4. FAVORITES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    thumbnail_url TEXT,
    channel_title VARCHAR(255),
    mood_id UUID REFERENCES public.moods(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, video_id)
);

-- --------------------------------------------------------
-- 5. PLAYLISTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT DEFAULT 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 6. PLAYLIST SONGS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlist_songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    video_id VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    thumbnail_url TEXT,
    channel_title VARCHAR(255),
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, video_id)
);

-- --------------------------------------------------------
-- 7. LISTENING HISTORY TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.listening_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    thumbnail_url TEXT,
    channel_title VARCHAR(255),
    mood_id UUID REFERENCES public.moods(id) ON DELETE SET NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 8. SEARCH HISTORY TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    mood_id UUID REFERENCES public.moods(id) ON DELETE SET NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- 9. USER PREFERENCES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    preferred_moods JSONB DEFAULT '[]'::jsonb,
    preferred_genres JSONB DEFAULT '[]'::jsonb,
    preferred_artists JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User can update own profile
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Moods & Keywords: Public read, Admin write
CREATE POLICY "Allow public read access to moods" ON public.moods FOR SELECT USING (true);
CREATE POLICY "Allow public read access to mood_keywords" ON public.mood_keywords FOR SELECT USING (true);

-- Favorites: Authenticated users can CRUD own favorites
CREATE POLICY "Allow users to manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Playlists: Authenticated users can CRUD own playlists
CREATE POLICY "Allow users to manage own playlists" ON public.playlists FOR ALL USING (auth.uid() = user_id);

-- Playlist Songs: User can manage songs if they own playlist
CREATE POLICY "Allow users to manage own playlist songs" ON public.playlist_songs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid())
);

-- History & Preferences: User access only
CREATE POLICY "Allow users to manage own listening history" ON public.listening_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage own search history" ON public.search_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- ========================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================================
-- SEED DEFAULT MOODS & KEYWORDS
-- ========================================================

INSERT INTO public.moods (name, icon, description, gradient_from, gradient_to) VALUES
('Happy', '😊', 'Upbeat, cheerful and feel-good hits to brighten your day', '#f59e0b', '#ef4444'),
('Sad', '😢', 'Emotional, gentle, and deep acoustic & ballad melodies', '#3b82f6', '#1e40af'),
('Relaxed', '😌', 'Calm lofi, chill ambient, and serene acoustic sounds', '#10b981', '#059669'),
('Energetic', '⚡', 'High tempo EDM, gym motivation, and heavy bass tracks', '#8b5cf6', '#ec4899'),
('Romantic', '❤️', 'Soulful love songs, acoustic ballads, and warm vibes', '#ec4899', '#f43f5e'),
('Focused', '🎯', 'Instrumental study beats, synthwave, and deep focus soundscapes', '#6366f1', '#3b82f6'),
('Motivational', '🔥', 'Inspiring soundtracks, uplifting pop, and powerhouse anthems', '#f97316', '#dc2626'),
('Sleepy', '😴', 'Soft piano, peaceful sleep music, and soothing rain noises', '#64748b', '#334155'),
('Party', '🎉', 'Dance club bangers, upbeat pop, and high energy party jams', '#d946ef', '#8b5cf6'),
('Nostalgic', '🕰️', 'Timeless classics, 80s/90s hits, and golden oldies', '#eab308', '#d97706')
ON CONFLICT (name) DO NOTHING;

-- Insert Mood Keywords
DO $$
DECLARE
    m_happy UUID;
    m_sad UUID;
    m_relaxed UUID;
    m_energetic UUID;
    m_romantic UUID;
    m_focused UUID;
    m_motivational UUID;
    m_sleepy UUID;
    m_party UUID;
    m_nostalgic UUID;
BEGIN
    SELECT id INTO m_happy FROM public.moods WHERE name = 'Happy';
    SELECT id INTO m_sad FROM public.moods WHERE name = 'Sad';
    SELECT id INTO m_relaxed FROM public.moods WHERE name = 'Relaxed';
    SELECT id INTO m_energetic FROM public.moods WHERE name = 'Energetic';
    SELECT id INTO m_romantic FROM public.moods WHERE name = 'Romantic';
    SELECT id INTO m_focused FROM public.moods WHERE name = 'Focused';
    SELECT id INTO m_motivational FROM public.moods WHERE name = 'Motivational';
    SELECT id INTO m_sleepy FROM public.moods WHERE name = 'Sleepy';
    SELECT id INTO m_party FROM public.moods WHERE name = 'Party';
    SELECT id INTO m_nostalgic FROM public.moods WHERE name = 'Nostalgic';

    IF m_happy IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_happy, 'happy upbeat songs 2026'), (m_happy, 'feel good music playlist'), (m_happy, 'positive vibe pop music');
    END IF;
    IF m_sad IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_sad, 'sad emotional acoustic songs'), (m_sad, 'heartbreak melancholy ballads'), (m_sad, 'crying slow songs playlist');
    END IF;
    IF m_relaxed IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_relaxed, 'relaxing chill lofi beats'), (m_relaxed, 'calm ambient study music'), (m_relaxed, 'peaceful acoustic chillout');
    END IF;
    IF m_energetic IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_energetic, 'high energy workout music'), (m_energetic, 'gym motivation edm tracks'), (m_energetic, 'fast electronic dance music');
    END IF;
    IF m_romantic IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_romantic, 'romantic love songs playlist'), (m_romantic, 'soft acoustic love ballads'), (m_romantic, 'romantic r&b soul music');
    END IF;
    IF m_focused IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_focused, 'deep focus instrumental study'), (m_focused, 'classical focus music work'), (m_focused, 'synthwave chillwave focus');
    END IF;
    IF m_motivational IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_motivational, 'inspirational epic soundtracks'), (m_motivational, 'powerful motivational music'), (m_motivational, 'success workout motivation pop');
    END IF;
    IF m_sleepy IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_sleepy, 'deep sleep relaxing music'), (m_sleepy, 'calm piano rain sleep sounds'), (m_sleepy, 'delta waves insomnia sleep');
    END IF;
    IF m_party IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_party, 'weekend party dance hits'), (m_party, 'club bangers pop playlist'), (m_party, 'top edm dance party hits');
    END IF;
    IF m_nostalgic IS NOT NULL THEN
        INSERT INTO public.mood_keywords (mood_id, keyword) VALUES
        (m_nostalgic, 'classic 80s 90s hit songs'), (m_nostalgic, 'retro old school golden music'), (m_nostalgic, 'throwback pop rock hits');
    END IF;
END $$;
