import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
export const SlotList = ({ slots, selectedDate, onSelectDate, isLoading }) => {
    if (isLoading) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Chargement des cr\u00E9neaux..." })] }));
    }
    if (!slots || slots.length === 0) {
        return (_jsx("div", { className: "text-center py-8 text-gray-600", children: "Aucun cr\u00E9neau disponible" }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "grid gap-4", children: slots.map((slot) => (_jsx(Card, { className: `p-6 cursor-pointer transition-all duration-300 ${selectedDate === slot.date
                ? "border-primary shadow-md"
                : "hover:border-gray-300 hover:shadow-lg"}`, onClick: () => onSelectDate(slot.date), children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-lg", children: format(new Date(slot.date), "dd MMMM yyyy", { locale: fr }) }), _jsxs("div", { className: "flex items-center text-gray-600 text-sm mt-1", children: [_jsx(Clock, { className: "h-4 w-4 mr-1 flex-shrink-0" }), _jsx("span", { children: "14h00 - 18h00" })] })] }), _jsxs("div", { className: "space-y-1 md:text-right", children: [_jsxs("p", { className: "text-gray-600", children: ["Circuit motocross : ", _jsxs("span", { className: "font-medium", children: [slot.circuit_1_available, " places"] })] }), _jsxs("p", { className: "text-gray-600", children: ["Circuit supercross : ", _jsxs("span", { className: "font-medium", children: [slot.circuit_2_available, " places"] })] })] })] }) }, slot.id))) }));
};
