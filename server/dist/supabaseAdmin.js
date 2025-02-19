import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error("⛔ Erreur : SUPABASE_URL ou SERVICE_ROLE_KEY non définies !");
}
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
