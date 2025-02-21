import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/supabase-client";
import { Label } from "@/components/ui/label";
export default function ForgotPasswordForm({ onBack }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastResetAttempt, setLastResetAttempt] = useState(0);
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez entrer votre adresse email",
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
        const now = Date.now();
        if (now - lastResetAttempt < 60000) { // 1 minute d'attente
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez patienter une minute avant de réessayer",
            });
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: import.meta.env.VITE_APP_URL ?
                    `${import.meta.env.VITE_APP_URL}/auth/reset-password` :
                    `${window.location.origin}/auth/reset-password`,
            });
            if (error) {
                if (error.message.includes('rate limit')) {
                    throw new Error("Trop de tentatives. Veuillez réessayer plus tard.");
                }
                throw error;
            }
            setLastResetAttempt(now);
            toast({
                title: "Email envoyé",
                description: "Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.",
            });
            // Retour à la page de connexion après 2 secondes
            setTimeout(() => {
                onBack();
            }, 2000);
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de l'envoi de l'email",
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(Button, { variant: "ghost", className: "w-fit h-fit p-0 mb-4", onClick: onBack, children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), "Retour"] }), _jsx(CardTitle, { children: "Mot de passe oubli\u00E9" }), _jsx(CardDescription, { children: "Entrez votre adresse email pour recevoir un lien de r\u00E9initialisation" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", role: "form", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "reset-email", children: "Email" }), _jsx(Input, { id: "reset-email", type: "email", placeholder: "exemple@email.com", value: email, onChange: (e) => setEmail(e.target.value), disabled: loading, required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Envoi en cours..." : "Envoyer le lien" })] }) })] }));
}
