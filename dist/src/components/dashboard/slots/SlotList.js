import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
export const SlotList = ({ slots }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDeletingSlot, setIsDeletingSlot] = useState(false);
    const [isUpdatingDate, setIsUpdatingDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const handleDeleteSlot = async (slotId) => {
        setIsDeletingSlot(true);
        try {
            const { error } = await supabase
                .from("slots")
                .delete()
                .eq("id", slotId);
            if (error)
                throw error;
            toast({
                title: "Succès",
                description: "Le créneau et ses réservations ont été supprimés",
            });
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["slots"] }),
                queryClient.refetchQueries({ queryKey: ["slots"] })
            ]);
        }
        catch (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        }
        finally {
            setIsDeletingSlot(false);
        }
    };
    const handleUpdateDate = async (slotId) => {
        if (!selectedDate) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner une date",
                variant: "destructive",
            });
            return;
        }
        setIsUpdatingDate(true);
        try {
            const { error } = await supabase
                .from("slots")
                .update({
                date: format(selectedDate, "yyyy-MM-dd"),
                updated_at: new Date().toISOString()
            })
                .eq("id", slotId);
            if (error)
                throw error;
            toast({
                title: "Succès",
                description: "La date du créneau a été mise à jour",
            });
            setSelectedDate(undefined);
            setSelectedSlotId(null);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["slots"] }),
                queryClient.refetchQueries({ queryKey: ["slots"] })
            ]);
        }
        catch (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        }
        finally {
            setIsUpdatingDate(false);
        }
    };
    return (_jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Cr\u00E9neaux existants" }), _jsx("div", { className: "grid gap-4", children: slots.map((slot) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: format(new Date(slot.date), "dd MMMM yyyy", { locale: fr }) }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Circuit motocross : ", slot.circuit_1_available, " places disponibles sur ", slot.circuit_1_capacity, " | Circuit supercross : ", slot.circuit_2_available, " places disponibles sur ", slot.circuit_2_capacity] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", onClick: () => setSelectedSlotId(slot.id), className: "transition-transform hover:scale-110", children: _jsx(Calendar, { className: "h-5 w-5 text-secondary" }) }) }), _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Modifier la date" }), _jsx(DialogDescription, { children: "S\u00E9lectionnez une nouvelle date pour ce cr\u00E9neau. Les r\u00E9servations existantes seront conserv\u00E9es." })] }), _jsx("div", { className: "py-4", children: _jsx(CalendarComponent, { mode: "single", selected: selectedDate, onSelect: setSelectedDate, locale: fr }) }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                                                setSelectedDate(undefined);
                                                                setSelectedSlotId(null);
                                                            }, children: "Annuler" }), _jsx(Button, { onClick: () => handleUpdateDate(slot.id), disabled: !selectedDate || isUpdatingDate, children: "Confirmer" })] })] })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDeleteSlot(slot.id), disabled: isDeletingSlot, className: "transition-transform hover:scale-110", children: _jsx(Trash2, { className: "h-5 w-5 text-primary" }) })] })] }, slot.id))) })] }));
};
