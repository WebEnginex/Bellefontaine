import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    selectedDate: string | undefined,
    circuit: string,
    numberOfPilots: string,
    slotsWithBookings: any[],
    hasExistingBooking: boolean
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer une réservation.",
      });
      return null;
    }

    if (hasExistingBooking) {
      toast({
        variant: "destructive",
        title: "Réservation impossible",
        description: "Vous avez déjà une réservation pour ce créneau.",
      });
      return;
    }

    if (!selectedDate || !circuit || !numberOfPilots) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs du formulaire.",
      });
      return;
    }

    const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
    if (!selectedSlot) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le créneau sélectionné n'est plus disponible.",
      });
      return;
    }

    const circuitNumber = circuit === "motocross" ? 1 : 2;
    const availablePlaces = circuitNumber === 1 
      ? selectedSlot.circuit_1_available 
      : selectedSlot.circuit_2_available;
    
    if (availablePlaces < parseInt(numberOfPilots)) {
      toast({
        variant: "destructive",
        title: "Places insuffisantes",
        description: `Il ne reste que ${availablePlaces} place(s) disponible(s) sur ce circuit.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          slot_id: selectedSlot.id,
          circuit_number: circuitNumber,
          number_of_pilots: parseInt(numberOfPilots),
          payment_status: 'pending',
        });

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['slots-with-bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
      ]);

      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de réservation",
        description: error.message,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
