import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
export default function Auth() {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("signin");
    const navigate = useNavigate();
    // Vérifier si on est sur la page de réinitialisation de mot de passe
    const isResetPasswordPage = window.location.pathname.includes("reset-password");
    if (isResetPasswordPage) {
        return (_jsx("div", { className: "flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8", children: _jsx("div", { className: "w-full max-w-md", children: _jsx(ResetPasswordForm, {}) }) }));
    }
    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };
    const handleBackToSignIn = () => {
        setShowForgotPassword(false);
    };
    const handleAuthSuccess = () => {
        navigate("/");
    };
    if (showForgotPassword) {
        return (_jsx("div", { className: "flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8", children: _jsx("div", { className: "w-full max-w-md", children: _jsx(ForgotPasswordForm, { onBack: handleBackToSignIn }) }) }));
    }
    return (_jsx("div", { className: "flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs(Tabs, { defaultValue: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-6", children: [_jsx(TabsTrigger, { value: "signin", children: "Connexion" }), _jsx(TabsTrigger, { value: "signup", children: "Inscription" })] }), _jsx(TabsContent, { value: "signin", className: "mt-0", children: _jsx(SignInForm, { onForgotPasswordClick: handleForgotPassword }) }), _jsx(TabsContent, { value: "signup", className: "mt-0", children: _jsx(SignUpForm, { onSuccess: () => setActiveTab("signin") }) })] }) }) }));
}
