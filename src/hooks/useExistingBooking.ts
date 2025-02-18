import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useAuth } from "@/contexts/AuthContext";

export const useExistingBooking = (selectedDate: string | undefined, slotsWithBookings: any[]) => {
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkExistingBooking = async () => {
      if (!user || !selectedDate) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .eq('slot_id', slotsWithBookings?.find(slot => slot.date === selectedDate)?.id);

      if (error) {
        console.error('Error checking bookings:', error);
        return;
      }

      setHasExistingBooking(data && data.length > 0);
    };

    checkExistingBooking();
  }, [user, selectedDate, slotsWithBookings]);

  return { hasExistingBooking };
};
