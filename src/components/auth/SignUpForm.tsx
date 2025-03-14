import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    
    const errors = [];
    if (password.length < minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
    }
    if (!hasUpperCase) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }
    
    return errors;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
      });
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères et une majuscule",
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, firstName, lastName);
      // Si l'inscription réussit, on réinitialise les champs
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      onSuccess();
    } catch (error: any) {
      if (error.message.includes('rate limit')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Trop de tentatives. Veuillez réessayer plus tard.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'inscription",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour commencer à réserver des sessions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp} role="form">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-firstname">Prénom</Label>
              <Input
                id="signup-firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-lastname">Nom</Label>
              <Input
                id="signup-lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <span className="text-sm text-muted-foreground">
                  (6 caractères et 1 majuscule minimum)
                </span>
              </div>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
