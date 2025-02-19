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
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    );
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
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <ForgotPasswordForm onBack={handleBackToSignIn} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-0">
            <SignInForm onForgotPasswordClick={handleForgotPassword} />
          </TabsContent>
          <TabsContent value="signup" className="mt-0">
            <SignUpForm onSuccess={() => setActiveTab("signin")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
