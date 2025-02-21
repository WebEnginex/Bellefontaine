import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Label, Input, toast, } from "@/components/ui";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { format, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
export const SlotManagement = () => {
    const queryClient = useQueryClient();
    useRealtimeUpdates();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [newSlot, setNewSlot] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        circuit_1_capacity: 20,
        circuit_2_capacity: 20,
    });
    const { data: slots, isLoading } = useQuery({
        queryKey: ["slots"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("slots")
                .select("*")
                .order("date", { ascending: true });
            if (error)
                throw error;
            return data;
        },
    });
    const createSlotMutation = useMutation({
        mutationFn: async (newSlot) => {
            // Vérifier si la date n'est pas dépassée
            if (isBefore(new Date(newSlot.date), startOfDay(new Date()))) {
                throw new Error("Impossible de créer un créneau pour une date passée");
            }
            // Vérifier si un créneau existe déjà pour cette date
            const { data: existingSlots, error: searchError } = await supabase
                .from("slots")
                .select("id")
                .eq("date", newSlot.date)
                .limit(1);
            if (searchError) {
                throw new Error("Erreur lors de la vérification de la date");
            }
            if (existingSlots && existingSlots.length > 0) {
                throw new Error("Un créneau existe déjà pour cette date");
            }
            const { data, error } = await supabase
                .from("slots")
                .insert([{
                    ...newSlot,
                    circuit_1_available: newSlot.circuit_1_capacity,
                    circuit_2_available: newSlot.circuit_2_capacity,
                }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            setIsCreateDialogOpen(false);
            setNewSlot({
                date: format(new Date(), 'yyyy-MM-dd'),
                circuit_1_capacity: 20,
                circuit_2_capacity: 20,
            });
            toast({
                title: "Succès",
                description: "Le créneau a été créé avec succès",
            });
        },
        onError: (error) => {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    const updateSlotMutation = useMutation({
        mutationFn: async (slot) => {
            // Vérifier si la date n'est pas dépassée
            if (isBefore(new Date(slot.date), startOfDay(new Date()))) {
                throw new Error("Impossible de modifier un créneau pour une date passée");
            }
            // Calculer le nombre de places déjà réservées
            const placesReserveesCircuit1 = slot.circuit_1_capacity - slot.circuit_1_available;
            const placesReserveesCircuit2 = slot.circuit_2_capacity - slot.circuit_2_available;
            // Vérifier que la nouvelle capacité n'est pas inférieure au nombre de places réservées
            if (slot.circuit_1_capacity < placesReserveesCircuit1) {
                throw new Error(`Impossible de réduire la capacité du circuit 1 en dessous de ${placesReserveesCircuit1} places (places déjà réservées)`);
            }
            if (slot.circuit_2_capacity < placesReserveesCircuit2) {
                throw new Error(`Impossible de réduire la capacité du circuit 2 en dessous de ${placesReserveesCircuit2} places (places déjà réservées)`);
            }
            // Calculer le nouveau nombre de places disponibles
            // Places disponibles = nouvelle capacité - places déjà réservées
            const newCircuit1Available = slot.circuit_1_capacity - placesReserveesCircuit1;
            const newCircuit2Available = slot.circuit_2_capacity - placesReserveesCircuit2;
            const { data, error } = await supabase
                .from("slots")
                .update({
                date: slot.date,
                circuit_1_capacity: slot.circuit_1_capacity,
                circuit_2_capacity: slot.circuit_2_capacity,
                circuit_1_available: newCircuit1Available,
                circuit_2_available: newCircuit2Available,
            })
                .eq("id", slot.id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            setIsEditDialogOpen(false);
            setSelectedSlot(null);
            toast({
                title: "Succès",
                description: "Le créneau a été modifié avec succès",
            });
        },
        onError: (error) => {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        },
    });
    const deleteSlotMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from("slots")
                .delete()
                .eq("id", id);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            setIsDeleteDialogOpen(false);
            setSelectedSlot(null);
            toast({
                title: "Succès",
                description: "Le créneau a été supprimé avec succès",
            });
        },
        onError: (error) => {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le créneau",
                variant: "destructive",
            });
        },
    });
    if (isLoading) {
        return _jsx("div", { children: "Chargement..." });
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Gestion des cr\u00E9neaux" }) }), _jsxs(CardContent, { children: [_jsx(Button, { onClick: () => setIsCreateDialogOpen(true), children: "Ajouter un cr\u00E9neau" }), _jsx("div", { className: "mt-4", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Places Motocross" }), _jsx(TableHead, { children: "Places Supercross" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: slots?.map((slot) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: format(new Date(slot.date), "dd MMMM yyyy", { locale: fr }) }), _jsxs(TableCell, { children: [slot.circuit_1_available, " / ", slot.circuit_1_capacity] }), _jsxs(TableCell, { children: [slot.circuit_2_available, " / ", slot.circuit_2_capacity] }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                                                        setSelectedSlot(slot);
                                                                        setIsEditDialogOpen(true);
                                                                    }, children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                                                        setSelectedSlot(slot);
                                                                        setIsDeleteDialogOpen(true);
                                                                    }, children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, slot.id))) })] }) })] })] }), _jsx(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Ajouter un cr\u00E9neau" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "date", children: "Date" }), _jsx(Input, { id: "date", type: "date", min: format(new Date(), 'yyyy-MM-dd'), value: newSlot.date, onChange: (e) => setNewSlot({ ...newSlot, date: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "circuit_1_capacity", children: "Places Motocross" }), _jsx(Input, { id: "circuit_1_capacity", type: "number", min: "0", value: newSlot.circuit_1_capacity, onChange: (e) => setNewSlot({
                                                        ...newSlot,
                                                        circuit_1_capacity: parseInt(e.target.value),
                                                    }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "circuit_2_capacity", children: "Places Supercross" }), _jsx(Input, { id: "circuit_2_capacity", type: "number", min: "0", value: newSlot.circuit_2_capacity, onChange: (e) => setNewSlot({
                                                        ...newSlot,
                                                        circuit_2_capacity: parseInt(e.target.value),
                                                    }) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreateDialogOpen(false), children: "Annuler" }), _jsx(Button, { onClick: () => createSlotMutation.mutate(newSlot), children: "Cr\u00E9er" })] })] }) }), _jsx(Dialog, { open: isEditDialogOpen, onOpenChange: setIsEditDialogOpen, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Modifier le cr\u00E9neau" }) }), selectedSlot && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "edit-date", children: "Date" }), _jsx(Input, { id: "edit-date", type: "date", min: format(new Date(), 'yyyy-MM-dd'), value: selectedSlot.date, onChange: (e) => setSelectedSlot({
                                                ...selectedSlot,
                                                date: e.target.value,
                                            }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs(Label, { htmlFor: "edit-circuit_1_capacity", children: ["Places Motocross (minimum : ", selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available, " places r\u00E9serv\u00E9es)"] }), _jsx(Input, { id: "edit-circuit_1_capacity", type: "number", min: selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available, value: selectedSlot.circuit_1_capacity, onChange: (e) => {
                                                        const newCapacity = parseInt(e.target.value);
                                                        const placesReservees = selectedSlot.circuit_1_capacity - selectedSlot.circuit_1_available;
                                                        // Mettre à jour la capacité et recalculer les places disponibles
                                                        setSelectedSlot({
                                                            ...selectedSlot,
                                                            circuit_1_capacity: newCapacity,
                                                            // Nouvelle capacité - places réservées = nouvelles places disponibles
                                                            circuit_1_available: newCapacity - placesReservees,
                                                        });
                                                    } })] }), _jsxs("div", { children: [_jsxs(Label, { htmlFor: "edit-circuit_2_capacity", children: ["Places Supercross (minimum : ", selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available, " places r\u00E9serv\u00E9es)"] }), _jsx(Input, { id: "edit-circuit_2_capacity", type: "number", min: selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available, value: selectedSlot.circuit_2_capacity, onChange: (e) => {
                                                        const newCapacity = parseInt(e.target.value);
                                                        const placesReservees = selectedSlot.circuit_2_capacity - selectedSlot.circuit_2_available;
                                                        // Mettre à jour la capacité et recalculer les places disponibles
                                                        setSelectedSlot({
                                                            ...selectedSlot,
                                                            circuit_2_capacity: newCapacity,
                                                            // Nouvelle capacité - places réservées = nouvelles places disponibles
                                                            circuit_2_available: newCapacity - placesReservees,
                                                        });
                                                    } })] })] })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsEditDialogOpen(false), children: "Annuler" }), _jsx(Button, { onClick: () => selectedSlot && updateSlotMutation.mutate(selectedSlot), children: "Enregistrer" })] })] }) }), _jsx(AlertDialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Supprimer le cr\u00E9neau" }), _jsx(AlertDialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir supprimer ce cr\u00E9neau ? Cette action est irr\u00E9versible." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { onClick: () => setIsDeleteDialogOpen(false), children: "Annuler" }), _jsx(AlertDialogAction, { onClick: () => selectedSlot && deleteSlotMutation.mutate(selectedSlot.id), children: "Supprimer" })] })] }) })] }));
};
