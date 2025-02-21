import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlotManagement } from "@/components/dashboard/SlotManagement";
import { BookingsList } from "@/components/dashboard/BookingsList";
import Messages from "@/components/dashboard/Messages";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("slots");
    const tabsListRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const tabs = [
        { value: "slots", label: "Créneaux" },
        { value: "motocross", label: "Réservations Motocross" },
        { value: "supercross", label: "Réservations Supercross" },
        { value: "messages", label: "Messages" },
    ];
    const checkScroll = () => {
        if (tabsListRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };
    useEffect(() => {
        const checkWindowSize = () => {
            setShowArrows(window.innerWidth < 768);
        };
        checkWindowSize();
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    }, []);
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);
    const scroll = (direction) => {
        if (tabsListRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = direction === 'left'
                ? tabsListRef.current.scrollLeft - scrollAmount
                : tabsListRef.current.scrollLeft + scrollAmount;
            tabsListRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 100);
        }
    };
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
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
    if (!user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    if (isLoadingProfile) {
        return _jsx("div", { className: "container mx-auto py-8", children: "Chargement..." });
    }
    if (profile?.role !== "admin") {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold mb-8", children: "Tableau de bord administrateur" }), _jsx(DirectionProvider, { dir: "ltr", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs("div", { className: "relative flex items-center gap-2", children: [showArrows && (_jsx(Button, { variant: "outline", size: "icon", onClick: () => scroll('left'), disabled: !canScrollLeft, className: "flex md:hidden min-w-10 z-10", "aria-label": "D\u00E9filer vers la gauche", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) })), _jsx("div", { ref: tabsListRef, className: "w-full overflow-x-auto scrollbar-hide", onScroll: checkScroll, children: _jsx(TabsList, { className: "w-full md:w-auto flex justify-start md:inline-flex", children: tabs.map((tab) => (_jsx(TabsTrigger, { value: tab.value, className: "flex-1 md:flex-none whitespace-nowrap", children: tab.label }, tab.value))) }) }), showArrows && (_jsx(Button, { variant: "outline", size: "icon", onClick: () => scroll('right'), disabled: !canScrollRight, className: "flex md:hidden min-w-10 z-10", "aria-label": "D\u00E9filer vers la droite", children: _jsx(ChevronRight, { className: "h-4 w-4" }) }))] }), _jsx(TabsContent, { value: "slots", className: "min-h-[300px]", children: _jsx(SlotManagement, {}) }), _jsx(TabsContent, { value: "motocross", className: "min-h-[300px]", children: _jsx(BookingsList, { circuitNumber: 1 }) }), _jsx(TabsContent, { value: "supercross", className: "min-h-[300px]", children: _jsx(BookingsList, { circuitNumber: 2 }) }), _jsx(TabsContent, { value: "messages", className: "min-h-[300px]", children: _jsx(Messages, {}) })] }) })] }));
};
export default Dashboard;
