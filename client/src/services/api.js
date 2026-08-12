import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://daeyvqdmmatklkfmvjho.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZXl2cWRtbWF0a2xrZm12amhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjQ2NDgsImV4cCI6MjEwMjA0MDY0OH0.Fo2m1uazfh0NnfLdNWZ26HMqf9DOuq4mgZX_1LsR8x4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Interceptor to attach Supabase session JWT to requests
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {}
  return config;
}, (error) => Promise.reject(error));

export default api;
