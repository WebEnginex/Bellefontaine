import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAvailableSlots } from "./useAvailableSlots";
import { useExistingBooking } from "./useExistingBooking";
import { useBookingSubmission } from "./useBookingSubmission";

export const useReservation = () => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [circuit, setCircuit] = useState<string>("");
  const [numberOfPilots, setNumberOfPilots] = useState<string>("1");
  const { user } = useAuth();
  const { slotsWithBookings, isLoading } = useAvailableSlots();
  const { hasExistingBooking } = useExistingBooking(selectedDate, slotsWithBookings);
  const { isSubmitting, handleSubmit: submitBooking } = useBookingSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitBooking(
      selectedDate,
      circuit,
      numberOfPilots,
      slotsWithBookings,
      hasExistingBooking
    );

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
    isSubmitting,
    hasExistingBooking,
    slotsWithBookings,
    isLoading,
    handleSubmit,
    user
  };
};
