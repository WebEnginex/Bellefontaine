import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAvailableSlots } from "./useAvailableSlots";
import { useExistingBooking } from "./useExistingBooking";
import { useBookingSubmission } from "./useBookingSubmission";
export const useReservation = () => {
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [circuit, setCircuit] = useState("");
    const [numberOfPilots, setNumberOfPilots] = useState("1");
    const { user } = useAuth();
    const { slotsWithBookings, isLoading } = useAvailableSlots();
    const { hasExistingBooking } = useExistingBooking(selectedDate, slotsWithBookings || []);
    const { isSubmitting, handleSubmit: submitBooking } = useBookingSubmission();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !slotsWithBookings)
            return false;
        const success = await submitBooking(selectedDate, circuit, numberOfPilots, slotsWithBookings, hasExistingBooking);
        if (success) {
            setSelectedDate(undefined);
            setCircuit("");
            setNumberOfPilots("1");
        }
        return success;
    };
    return {
        selectedDate,
        setSelectedDate,
        circuit,
        setCircuit,
        numberOfPilots,
        setNumberOfPilots,
        user,
        slotsWithBookings,
        isLoading,
        hasExistingBooking,
        isSubmitting,
        handleSubmit,
    };
};
