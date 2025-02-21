import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
export function SignInForm({ onForgotPasswordClick }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez entrer une adresse email valide",
                duration: 5000,
            });
            return;
        }
        if (!password) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez entrer votre mot de passe",
                duration: 5000,
            });
            return;
        }
        try {
            setLoading(true);
            await signIn(email, password);
        }
        catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Email ou mot de passe incorrect",
                duration: 5000,
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Connexion" }), _jsx(CardDescription, { children: "Connectez-vous pour acc\u00E9der \u00E0 votre compte" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", role: "form", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "exemple@email.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Mot de passe" }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Connexion..." : "Se connecter" }), _jsx(Button, { type: "button", variant: "link", className: "w-full", onClick: onForgotPasswordClick, children: "Mot de passe oubli\u00E9 ?" })] }) })] }));
}
