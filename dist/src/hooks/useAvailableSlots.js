import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { useRealtimeUpdates } from "./useRealtimeUpdates";
export const useAvailableSlots = () => {
    // Setup real-time updates
    useRealtimeUpdates();
    const { data: slotsWithBookings, isLoading } = useQuery({
        queryKey: ['slots-with-bookings'],
        queryFn: async () => {
            // Get today's date at midnight local time
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { data: slots, error: slotsError } = await supabase
                .from('slots')
                .select(`
          *,
          bookings (
            id,
            circuit_number,
            number_of_pilots
          )
        `)
                .gte('date', today.toISOString().split('T')[0])
                .order('date', { ascending: true });
            if (slotsError) {
                console.error("Error fetching slots:", slotsError);
                throw slotsError;
            }
            // Filter out slots with no available places
            const availableSlots = slots?.filter(slot => slot.circuit_1_available > 0 || slot.circuit_2_available > 0);
            return availableSlots || [];
        },
        staleTime: 0,
        gcTime: 0,
    });
    return { slotsWithBookings, isLoading };
};
