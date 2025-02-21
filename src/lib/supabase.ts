import { createClient } from '@supabase/supabase-js';

// Vérification des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables Supabase manquantes:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Définie' : 'Manquante');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Définie' : 'Manquante');
  throw new Error('Les variables d\'environnement Supabase sont requises');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      // Définissez vos tables ici
      // exemple:
      // users: {
      //   Row: {
      //     id: string
      //     name: string
      //     email: string
      //   }
      //   Insert: {
      //     id?: string
      //     name: string
      //     email: string
      //   }
      //   Update: {
      //     id?: string
      //     name?: string
      //     email?: string
      //   }
      // }
    }
  }
}

export type { User, Session } from '@supabase/supabase-js';
