import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays, differenceInHours, isSameDay, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Clock, User, Mail, UserCircle, AlertCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useState } from "react";
export default function Account() {
    const { user } = useAuth();
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const { data: profile } = useQuery({
        queryKey: ["profile", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user?.id)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!user?.id,
    });
    const { data: bookings, refetch } = useQuery({
        queryKey: ["user-bookings", user?.id],
        queryFn: async () => {
            const now = new Date();
            console.log("Date actuelle:", now);
            console.log("User ID:", user?.id);
            const { data, error } = await supabase
                .from("bookings")
                .select(`
          *,
          slots (
            *
          )
        `)
                .eq("user_id", user?.id)
                .order("slots(date)", { ascending: true });
            if (error) {
                console.error("Erreur lors de la requête:", error);
                throw error;
            }
            console.log("Réservations reçues:", data);
            // Filtrer les réservations dont la date est passée
            const filteredBookings = data.filter(booking => {
                if (!booking.slots?.date) {
                    console.log("Réservation sans date:", booking);
                    return false;
                }
                const slotDate = new Date(booking.slots.date);
                console.log("Date du créneau:", slotDate);
                return slotDate >= now;
            });
            console.log("Réservations filtrées:", filteredBookings);
            return filteredBookings;
        },
        enabled: !!user?.id,
    });
    const handleCancelBooking = async (bookingId) => {
        try {
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", bookingId);
            if (error) {
                console.error("Error deleting booking:", error);
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de l'annulation",
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Réservation annulée",
                description: "Votre réservation a été annulée avec succès",
            });
            refetch();
        }
        catch (error) {
            console.error("Error canceling booking:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'annulation",
                variant: "destructive",
            });
        }
        finally {
            setBookingToDelete(null);
        }
    };
    const getCircuitName = (number) => number === 1 ? "Motocross" : "Supercross";
    if (!user) {
        return _jsx(Navigate, { to: "/auth" });
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-6 md:py-8 max-w-4xl", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold mb-6 md:mb-8", children: "Mon compte" }), _jsxs("div", { className: "space-y-4 md:space-y-6", children: [_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-xl md:text-2xl flex items-center gap-2", children: [_jsx(UserCircle, { className: "h-6 w-6" }), "Mon profil"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(User, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-primary mb-1", children: "Pr\u00E9nom" }), _jsx("p", { className: "text-muted-foreground", children: profile?.first_name || "Non renseigné" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(User, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-primary mb-1", children: "Nom" }), _jsx("p", { className: "text-muted-foreground", children: profile?.last_name || "Non renseigné" })] })] }), _jsxs("div", { className: "flex items-start gap-3 md:col-span-2", children: [_jsx(Mail, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-primary mb-1", children: "Email" }), _jsx("p", { className: "text-muted-foreground", children: profile?.email })] })] }), _jsxs("div", { className: "flex items-start gap-3 md:col-span-2 pt-2 border-t", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-muted-foreground mt-0.5" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Pour modifier vos informations, veuillez nous contacter via le formulaire de contact." })] })] }) })] }), _jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xl md:text-2xl", children: "Mes r\u00E9servations" }) }), _jsx(CardContent, { children: !bookings || bookings.length === 0 ? (_jsx("p", { className: "text-muted-foreground", children: "Vous n'avez pas encore de r\u00E9servation." })) : (_jsx("div", { className: "space-y-4", children: bookings.map((booking) => (_jsx(Card, { className: "overflow-hidden", children: _jsx(CardContent, { className: "p-4 md:p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row md:justify-between md:items-start gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("h3", { className: "font-semibold text-base md:text-lg", children: ["Circuit : ", getCircuitName(booking.circuit_number)] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Date :", " ", format(new Date(booking.slots.date), "d MMMM yyyy", { locale: fr })] }), _jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: "14h00 - 18h00" })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Nombre de pilotes : ", booking.number_of_pilots] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Statut : v\u00E9rifi\u00E9" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Paiement : sur place" })] })] }), _jsx(Button, { variant: "destructive", onClick: () => setBookingToDelete(booking.id), className: "w-full md:w-auto bg-red-600 hover:bg-red-700 text-white", children: "Annuler ma r\u00E9servation" })] }) }) }, booking.id))) })) })] })] }), _jsx(AlertDialog, { open: !!bookingToDelete, onOpenChange: () => setBookingToDelete(null), children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Confirmer l'annulation" }), _jsxs(AlertDialogDescription, { className: "space-y-4", children: [_jsx("p", { children: "\u00CAtes-vous s\u00FBr de vouloir annuler cette r\u00E9servation ?" }), bookingToDelete && bookings?.find(b => b.id === bookingToDelete)?.slots?.date && (_jsx("p", { className: "text-yellow-600 dark:text-yellow-500", children: getBookingWarningMessage(bookings.find(b => b.id === bookingToDelete)?.slots.date) })), _jsx("p", { className: "text-sm text-muted-foreground", children: "Cette action est irr\u00E9versible." })] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Annuler" }), _jsx(AlertDialogAction, { onClick: () => bookingToDelete && handleCancelBooking(bookingToDelete), className: "bg-red-600 hover:bg-red-700 text-white", children: "Confirmer l'annulation" })] })] }) })] }));
}
function getBookingWarningMessage(bookingDate) {
    const today = new Date();
    const reservationDate = new Date(bookingDate);
    // Set the reservation time to 14:00
    const reservationDateTime = setMinutes(setHours(reservationDate, 14), 0);
    const daysUntilReservation = differenceInDays(reservationDateTime, today);
    const hoursUntilReservation = differenceInHours(reservationDateTime, today);
    if (isSameDay(today, reservationDate)) {
        return "⚠️ Attention : Vous annulez une réservation pour aujourd'hui. Cette annulation tardive peut impacter l'organisation.";
    }
    else if (daysUntilReservation < 1) {
        return `⚠️ Attention : Vous annulez une réservation prévue dans ${hoursUntilReservation} heure${hoursUntilReservation > 1 ? 's' : ''}.`;
    }
    else if (daysUntilReservation <= 2) {
        return `⚠️ Attention : Vous annulez une réservation prévue dans ${daysUntilReservation} jour${daysUntilReservation > 1 ? 's' : ''}.`;
    }
    return null;
}
