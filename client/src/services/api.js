import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultBaseURL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
const configuredURL = import.meta.env.VITE_API_URL;
const baseURL = (configuredURL && !configuredURL.includes('localhost')) ? configuredURL : defaultBaseURL;

const api = axios.create({
  baseURL
});

// Interceptor to attach Supabase session JWT to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
