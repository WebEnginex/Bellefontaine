import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const isAdmin = profile?.role === "admin";

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path ? "text-primary" : "";
  };

  const NavLinks = () => (
    <>
      <button 
        onClick={() => handleNavigation("/")} 
        className={`hover:text-primary transition-colors text-left ${isActivePath("/")}`}
      >
        Accueil
      </button>
      {/* <button 
        onClick={() => handleNavigation("/circuits")} 
        className={`hover:text-primary transition-colors text-left ${isActivePath("/circuits")}`}
      >
        Circuits
      </button> */}
      <button 
        onClick={() => handleNavigation("/reserver")} 
        className={`hover:text-primary transition-colors text-left ${isActivePath("/reserver")}`}
      >
        Réserver
      </button>
      <button 
        onClick={() => handleNavigation("/contact")} 
        className={`hover:text-primary transition-colors text-left ${isActivePath("/contact")}`}
      >
        Contact
      </button>
      {user ? (
        <>
          <button 
            onClick={() => handleNavigation("/account")} 
            className={`hover:text-primary transition-colors text-left ${isActivePath("/account")}`}
          >
            Mon compte
          </button>
          {isAdmin && (
            <button 
              onClick={() => handleNavigation("/dashboard")} 
              className={`hover:text-primary transition-colors text-left ${isActivePath("/dashboard")}`}
            >
              Dashboard
            </button>
          )}
          <Button
            onClick={handleSignOut}
            className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6"
          >
            Déconnexion
          </Button>
        </>
      ) : (
        <button
          onClick={() => handleNavigation("/auth")}
          className={`bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 text-left ${isActivePath("/auth")}`}
        >
          Connexion
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-montserrat font-bold text-2xl text-primary">
            Circuit de Bellefontaine
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
              <div className="flex flex-col gap-6 mt-6">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
