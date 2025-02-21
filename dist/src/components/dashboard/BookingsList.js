import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button, Card } from "@/components/ui";
import { Check, X, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export const BookingsList = ({ circuitNumber }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [bookingToDelete, setBookingToDelete] = React.useState(null);
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ["bookings", circuitNumber],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bookings")
                .select(`
          *,
          slot:slots!slot_id(*),
          profile:profiles!user_id(*)
        `)
                .eq("circuit_number", circuitNumber)
                .order("slot(date)", { ascending: true });
            if (error) {
                console.error("Erreur lors du chargement des réservations:", error);
                throw error;
            }
            return data;
        },
    });
    const handleUpdatePaymentStatus = async (bookingId, currentStatus) => {
        try {
            const newStatus = currentStatus === "paid" ? "pending" : "paid";
            const { error } = await supabase
                .from("bookings")
                .update({ payment_status: newStatus })
                .eq("id", bookingId);
            if (error)
                throw error;
            toast({
                title: "Succès",
                description: `Le statut de paiement a été ${newStatus === "paid" ? "confirmé" : "annulé"}`,
            });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
        catch (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        }
    };
    const handleDeleteBooking = async () => {
        if (!bookingToDelete)
            return;
        try {
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", bookingToDelete);
            if (error)
                throw error;
            toast({
                title: "Succès",
                description: "La réservation a été annulée",
            });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            setBookingToDelete(null);
        }
        catch (error) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
            });
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[200px]", children: _jsx("span", { className: "loading loading-spinner loading-md" }) }));
    }
    if (error) {
        return (_jsx(Card, { className: "p-6", children: _jsxs("p", { className: "text-center text-red-500", children: ["Erreur lors du chargement des r\u00E9servations : ", error.message] }) }));
    }
    if (!bookings || bookings.length === 0) {
        return (_jsx(Card, { className: "p-6", children: _jsx("p", { className: "text-center text-gray-500", children: "Aucune r\u00E9servation trouv\u00E9e" }) }));
    }
    // Grouper les réservations par date de créneau
    const groupedBookings = bookings.reduce((acc, booking) => {
        const date = booking.slot?.date || "Date inconnue";
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(booking);
        return acc;
    }, {});
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-8", children: Object.entries(groupedBookings).map(([date, dateBookings]) => (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: date !== "Date inconnue"
                                ? format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })
                                : date }), _jsx("div", { className: "grid gap-4", children: dateBookings.map((booking) => (_jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsxs("h3", { className: "text-lg font-medium", children: [booking.profile?.first_name, " ", booking.profile?.last_name] }), _jsxs("p", { className: "text-sm text-gray-600", children: [booking.number_of_pilots, " pilote", booking.number_of_pilots > 1 ? "s" : ""] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [booking.payment_status === "paid" ? (_jsx(Button, { variant: "outline", size: "icon", onClick: () => handleUpdatePaymentStatus(booking.id, booking.payment_status), className: "h-8 w-8", children: _jsx(X, { className: "h-4 w-4 text-gray-700" }) })) : (_jsx(Button, { variant: "default", size: "icon", onClick: () => handleUpdatePaymentStatus(booking.id, booking.payment_status), className: "h-8 w-8 bg-green-500 hover:bg-green-600", children: _jsx(Check, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 border-red-500 hover:bg-red-50", onClick: () => setBookingToDelete(booking.id), children: _jsx(Trash2, { className: "h-4 w-4 text-red-500" }) })] })] }) }, booking.id))) })] }, date))) }), _jsx(AlertDialog, { open: !!bookingToDelete, onOpenChange: () => setBookingToDelete(null), children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Confirmer l'annulation" }), _jsx(AlertDialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir annuler cette r\u00E9servation ? Cette action est irr\u00E9versible." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Annuler" }), _jsx(AlertDialogAction, { onClick: handleDeleteBooking, children: "Confirmer" })] })] }) })] }));
};
