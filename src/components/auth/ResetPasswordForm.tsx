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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLinkExpired(true);
          toast({
            variant: "destructive",
            title: "Lien expiré",
            description: "Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.",
            duration: 5000,
          });
        }
      } catch (error) {
        setIsLinkExpired(true);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification du lien. Veuillez réessayer.",
          duration: 5000,
        });
      }
    };

    checkResetToken();
  }, []);

  const handleRequestNewLink = () => {
    navigate("/auth", { state: { showForgotPassword: true } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        duration: 5000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        duration: 5000,
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été réinitialisé avec succès",
        duration: 5000,
      });

      // Rediriger vers la page de connexion
      navigate("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation du mot de passe",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLinkExpired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lien expiré</CardTitle>
          <CardDescription>
            Ce lien de réinitialisation n'est plus valide. Vous pouvez demander un nouveau lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRequestNewLink} className="w-full">
            Demander un nouveau lien
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>
          Entrez votre nouveau mot de passe ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
