import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Circuits from "@/pages/Circuits";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Reserver from "@/pages/Reserver";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/reset-password" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        {/* <Route path="/circuits" element={<Circuits />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reserver" element={<Reserver />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
