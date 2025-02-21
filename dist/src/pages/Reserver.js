import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircuitCard } from "@/components/reservation/CircuitCard";
import { FAQ } from "@/components/reservation/FAQ";
import { useReservation } from "@/hooks/useReservation";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";
import { SlotList } from "@/components/reservation/SlotList";
import { PilotSelection } from "@/components/reservation/PilotSelection";
import { ToastAction } from "@/components/ui/toast";
import motocrossImage from "/images_reserver/reserver_motocross.webp";
import supercrossImage from "/images_reserver/reserver_supercross.webp";
const ToastContent = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { children: _jsx("p", { children: "Votre r\u00E9servation a bien \u00E9t\u00E9 enregistr\u00E9e." }) }), _jsxs("div", { className: "space-y-2 text-sm text-muted-foreground", children: [_jsx("p", { children: "\u2022 R\u00E8glement : Le paiement se fera sur place" }), _jsx("p", { children: "\u2022 Gestion : Vous pouvez consulter et annuler vos r\u00E9servations depuis votre compte" })] }), _jsx(Button, { variant: "outline", className: "w-full", onClick: () => navigate("/account"), children: "Voir mes r\u00E9servations" })] }));
};
const Reserver = () => {
    const navigate = useNavigate();
    const { selectedDate, setSelectedDate, circuit, setCircuit, numberOfPilots, setNumberOfPilots, isSubmitting, hasExistingBooking, slotsWithBookings, isLoading, handleSubmit, user } = useReservation();
    const onSubmit = async (e) => {
        e.preventDefault();
        const success = await handleSubmit(e);
        if (success) {
            toast({
                title: "✅ Réservation confirmée",
                description: _jsx(ToastContent, {}),
                duration: 5000,
            });
        }
    };
    if (!user) {
        toast({
            title: "Connexion requise",
            description: "Vous devez être connecté pour accéder à la page de réservation.",
            action: (_jsx(ToastAction, { altText: "Se connecter", onClick: () => navigate("/auth"), children: "Se connecter" })),
            duration: 5000,
        });
        navigate("/auth");
        return null;
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4 py-16", children: [_jsx(ReservationHeader, {}), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("form", { onSubmit: onSubmit, className: "space-y-12", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: "S\u00E9lectionnez votre date" }), _jsx(SlotList, { slots: slotsWithBookings || [], selectedDate: selectedDate, onSelectDate: setSelectedDate, isLoading: isLoading })] }), selectedDate && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, className: "space-y-12", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Choisissez votre circuit" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsx(CircuitCard, { title: "Circuit Motocross", description: "Un circuit motocross technique avec des obstacles vari\u00E9s.", image: motocrossImage, isSelected: circuit === "motocross", onClick: () => {
                                                            const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                                                            if (selectedSlot && selectedSlot.circuit_1_available > 0) {
                                                                setCircuit("motocross");
                                                            }
                                                            else {
                                                                toast({
                                                                    title: "Circuit complet",
                                                                    description: "Il n'y a plus de places disponibles sur ce circuit.",
                                                                    duration: 5000,
                                                                });
                                                            }
                                                        }, availablePlaces: slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0, features: [
                                                            "Longueur : 1920 mètres",
                                                            "Obstacles naturels et artificiels",
                                                            "Grandes montées et descentes",
                                                            "Pour pilotes expérimentés"
                                                        ] }), _jsx(CircuitCard, { title: "Circuit Supercross", description: "Un circuit supercross avec des enchainements rapides et techniques.", image: supercrossImage, isSelected: circuit === "supercross", onClick: () => {
                                                            const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                                                            if (selectedSlot && selectedSlot.circuit_2_available > 0) {
                                                                setCircuit("supercross");
                                                            }
                                                            else {
                                                                toast({
                                                                    title: "Circuit complet",
                                                                    description: "Il n'y a plus de places disponibles sur ce circuit.",
                                                                    duration: 5000,
                                                                });
                                                            }
                                                        }, availablePlaces: slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0, features: [
                                                            "Longueur : 590 mètres",
                                                            "Sauts et whoops techniques",
                                                            "Sections rythmiques",
                                                            "Pour pilotes expérimentés"
                                                        ] })] })] }), circuit && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, className: "space-y-6 bg-white rounded-lg p-6 shadow-sm", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Nombre de pilotes" }), _jsx("p", { className: "text-sm text-muted-foreground", children: circuit === "motocross" ?
                                                                `${slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0} places disponibles` :
                                                                `${slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0} places disponibles` })] }), _jsxs("div", { className: "flex items-center gap-4 w-full md:w-auto", children: [_jsx(PilotSelection, { value: numberOfPilots, onChange: setNumberOfPilots, maxPilots: circuit === "motocross"
                                                                ? slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0
                                                                : slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0 }), _jsx(Button, { type: "submit", size: "lg", className: "w-full md:w-auto", disabled: isSubmitting || hasExistingBooking, children: isSubmitting ? "Réservation en cours..." : "Réserver" })] })] }) }))] }))] }) }), _jsx("div", { className: "max-w-4xl mx-auto mt-24", children: _jsx(FAQ, {}) })] }) }));
};
export default Reserver;
