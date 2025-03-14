import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/supabase-client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        throw new Error(errorMessage);
      }

      if (data.user) {
        navigate("/");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le Circuit de Bellefontaine !",
        });
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log("Début de l'inscription...");
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
          emailRedirectTo: import.meta.env.VITE_APP_URL ? 
            `${import.meta.env.VITE_APP_URL}/auth` :
            `${window.location.origin}/auth`
        }
      });

      console.log("Réponse de signUp:", { data, error: signUpError });

      if (signUpError) {
        console.error("Erreur détaillée:", signUpError);
        let errorMessage = "Une erreur est survenue lors de l'inscription";
        
        if (signUpError.message.includes("User already registered")) {
          errorMessage = "Un compte existe déjà avec cet email";
        } else if (signUpError.message.includes("Password should be at least 6 characters")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        throw new Error(errorMessage);
      }

      if (data.user) {
        console.log("Utilisateur créé avec succès");
        
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        });
        navigate("/reserver");
      }
    } catch (error: any) {
      console.error("Erreur complète d'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}