import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }
            catch (error) {
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
    const handleSubmit = async (e) => {
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
            if (error)
                throw error;
            toast({
                title: "Mot de passe mis à jour",
                description: "Votre mot de passe a été réinitialisé avec succès",
                duration: 5000,
            });
            // Rediriger vers la page de connexion
            navigate("/auth");
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la réinitialisation du mot de passe",
                duration: 5000,
            });
        }
        finally {
            setLoading(false);
        }
    };
    if (isLinkExpired) {
        return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Lien expir\u00E9" }), _jsx(CardDescription, { children: "Ce lien de r\u00E9initialisation n'est plus valide. Vous pouvez demander un nouveau lien pour r\u00E9initialiser votre mot de passe." })] }), _jsx(CardContent, { children: _jsx(Button, { onClick: handleRequestNewLink, className: "w-full", children: "Demander un nouveau lien" }) })] }));
    }
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "R\u00E9initialiser le mot de passe" }), _jsx(CardDescription, { children: "Entrez votre nouveau mot de passe ci-dessous" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Nouveau mot de passe" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirmer le mot de passe" }), _jsx(Input, { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe" })] }) })] }));
}
