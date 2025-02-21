import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export default function SignUpForm({ onSuccess }) {
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };
    const validatePassword = (password) => {
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
    const handleSignUp = async (e) => {
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
            setShowConfirmDialog(true);
        }
        catch (error) {
            if (error.message.includes('rate limit')) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Trop de tentatives. Veuillez réessayer plus tard.",
                });
            }
            else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: error.message || "Une erreur est survenue lors de l'inscription",
                });
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleConfirmation = () => {
        setShowConfirmDialog(false);
        onSuccess();
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { className: "space-y-1", children: [_jsx(CardTitle, { className: "text-2xl", children: "Inscription" }), _jsx(CardDescription, { children: "Cr\u00E9ez votre compte pour commencer \u00E0 r\u00E9server des sessions" })] }), _jsxs("form", { onSubmit: handleSignUp, role: "form", children: [_jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signup-firstname", children: "Pr\u00E9nom" }), _jsx(Input, { id: "signup-firstname", value: firstName, onChange: (e) => setFirstName(e.target.value), disabled: loading, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signup-lastname", children: "Nom" }), _jsx(Input, { id: "signup-lastname", value: lastName, onChange: (e) => setLastName(e.target.value), disabled: loading, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signup-email", children: "Email" }), _jsx(Input, { id: "signup-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), disabled: loading, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "signup-password", children: "Mot de passe" }), _jsx("span", { className: "text-sm text-muted-foreground", children: "(6 caract\u00E8res et 1 majuscule minimum)" })] }), _jsx(Input, { id: "signup-password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), disabled: loading, required: true })] })] }), _jsx(CardFooter, { children: _jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Inscription..." : "S'inscrire" }) })] })] }), _jsx(AlertDialog, { open: showConfirmDialog, onOpenChange: setShowConfirmDialog, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "V\u00E9rifiez votre bo\u00EEte mail" }), _jsx(AlertDialogDescription, { children: "Un email de confirmation vous a \u00E9t\u00E9 envoy\u00E9. Veuillez cliquer sur le lien dans l'email pour activer votre compte." })] }), _jsx(AlertDialogFooter, { children: _jsx(AlertDialogAction, { onClick: handleConfirmation, children: "Compris" }) })] }) })] }));
}
