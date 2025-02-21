import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
            if (!user?.id)
                return null;
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
    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };
    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
    };
    const isActivePath = (path) => {
        return location.pathname === path ? "text-primary" : "";
    };
    const NavLinks = () => (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleNavigation("/"), className: `hover:text-primary transition-colors text-left ${isActivePath("/")}`, children: "Accueil" }), _jsx("button", { onClick: () => handleNavigation("/reserver"), className: `hover:text-primary transition-colors text-left ${isActivePath("/reserver")}`, children: "R\u00E9server" }), _jsx("button", { onClick: () => handleNavigation("/contact"), className: `hover:text-primary transition-colors text-left ${isActivePath("/contact")}`, children: "Contact" }), user ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleNavigation("/account"), className: `hover:text-primary transition-colors text-left ${isActivePath("/account")}`, children: "Mon compte" }), isAdmin && (_jsx("button", { onClick: () => handleNavigation("/dashboard"), className: `hover:text-primary transition-colors text-left ${isActivePath("/dashboard")}`, children: "Dashboard" })), _jsx(Button, { onClick: handleSignOut, className: "bg-secondary hover:bg-secondary/90 text-white rounded-full px-6", children: "D\u00E9connexion" })] })) : (_jsx("button", { onClick: () => handleNavigation("/auth"), className: `bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 text-left ${isActivePath("/auth")}`, children: "Connexion" }))] }));
    return (_jsx("nav", { className: "bg-white shadow-md", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx(Link, { to: "/", className: "font-montserrat font-bold text-2xl text-primary", children: "Circuit de Bellefontaine" }), _jsx("div", { className: "hidden md:flex gap-6 items-center", children: _jsx(NavLinks, {}) }), _jsxs(Sheet, { open: isOpen, onOpenChange: setIsOpen, children: [_jsx(SheetTrigger, { asChild: true, className: "md:hidden", children: _jsxs(Button, { variant: "ghost", size: "icon", children: [_jsx(Menu, { className: "h-6 w-6" }), _jsx("span", { className: "sr-only", children: "Toggle menu" })] }) }), _jsx(SheetContent, { side: "right", className: "w-[80vw] sm:w-[385px]", children: _jsx("div", { className: "flex flex-col gap-6 mt-6", children: _jsx(NavLinks, {}) }) })] })] }) }) }));
};
export default Navbar;
