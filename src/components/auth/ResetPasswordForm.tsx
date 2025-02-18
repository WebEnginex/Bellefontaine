import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/supabase-client";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);

  useEffect(() => {
    const checkResetToken = async () => {
      const hash = window.location.hash;
      if (!hash) {
        setIsLinkExpired(true);
        return;
      }

      try {
        const accessToken = hash.split('=')[1];
        const { error } = await supabase.auth.getUser(accessToken);
        
        if (error) {
          setIsLinkExpired(true);
          toast({
            variant: "destructive",
            title: "Lien expiré",
            description: "Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.",
          });
        }
      } catch (error) {
        setIsLinkExpired(true);
      }
    };

    checkResetToken();
  }, []);

  const handleRequestNewLink = () => {
    navigate("/auth", { state: { showForgotPassword: true } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    
    if (password.length < minLength || !hasUpperCase) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères et une majuscule",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error("Trop de tentatives. Veuillez réessayer plus tard.");
        }
        throw error;
      }

      toast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour. Vous allez être redirigé vers la page de connexion.",
      });

      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du mot de passe",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLinkExpired) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Lien expiré</CardTitle>
          <CardDescription>
            Ce lien de réinitialisation n'est plus valide. Vous pouvez demander un nouveau lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRequestNewLink}
            className="w-full"
          >
            Demander un nouveau lien
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Réinitialisation du mot de passe</CardTitle>
        <CardDescription>
          Choisissez un nouveau mot de passe pour votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} role="form" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <span className="text-sm text-muted-foreground">
                (6 caractères et 1 majuscule minimum)
              </span>
            </div>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
