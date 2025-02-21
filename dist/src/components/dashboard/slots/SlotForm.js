import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
export const SlotForm = ({ disabledDays }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [circuit1Capacity, setCircuit1Capacity] = useState("10");
    const [circuit2Capacity, setCircuit2Capacity] = useState("10");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleCreateSlot = async () => {
        if (!selectedDate) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner une date",
                variant: "destructive",
            });
            return;
        }
        setIsSubmitting(true);
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            const circuit1CapacityNum = parseInt(circuit1Capacity);
            const circuit2CapacityNum = parseInt(circuit2Capacity);
            const { error } = await supabase.from("slots").insert({
                date: formattedDate,
                circuit_1_capacity: circuit1CapacityNum,
                circuit_2_capacity: circuit2CapacityNum,
                circuit_1_available: circuit1CapacityNum,
                circuit_2_available: circuit2CapacityNum,
            });
            if (error)
                throw error;
            toast({
                title: "Succès",
                description: "Le créneau a été créé avec succès",
            });
            setSelectedDate(undefined);
            setCircuit1Capacity("10");
            setCircuit2Capacity("10");
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
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "grid gap-6", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "font-medium", children: "S\u00E9lectionnez une date" }), _jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: setSelectedDate, disabled: disabledDays, locale: fr }), selectedDate && (_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Date s\u00E9lectionn\u00E9e : ", format(selectedDate, "dd MMMM yyyy", { locale: fr })] }))] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { htmlFor: "circuit1", className: "font-medium", children: "Places circuit motocross" }), _jsx(Input, { id: "circuit1", type: "number", min: "0", value: circuit1Capacity, onChange: (e) => setCircuit1Capacity(e.target.value) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { htmlFor: "circuit2", className: "font-medium", children: "Places circuit supercross" }), _jsx(Input, { id: "circuit2", type: "number", min: "0", value: circuit2Capacity, onChange: (e) => setCircuit2Capacity(e.target.value) })] })] }), _jsx(Button, { onClick: handleCreateSlot, disabled: !selectedDate || isSubmitting, children: "Cr\u00E9er le cr\u00E9neau" })] }));
};
