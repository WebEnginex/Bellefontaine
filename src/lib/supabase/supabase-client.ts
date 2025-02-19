// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) throw new Error('VITE_SUPABASE_URL est manquante');
if (!SUPABASE_ANON_KEY) throw new Error('VITE_SUPABASE_ANON_KEY est manquante');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
