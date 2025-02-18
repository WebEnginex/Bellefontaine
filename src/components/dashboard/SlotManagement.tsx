import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { supabase } from "@/lib/supabase/supabase-client";
import { SlotForm } from "./slots/SlotForm";
import { SlotList } from "./slots/SlotList";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export const SlotManagement = () => {
  useRealtimeUpdates();

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from("slots")
        .select("*")
        .gte('date', today.toISOString().split('T')[0])
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });
  
  const disabledDays = slots?.map(slot => new Date(slot.date)) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des disponibilités</CardTitle>
        <CardDescription>
          Créez des créneaux de réservation pour les circuits. Les créneaux sont de 14h à 18h.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSlots ? (
          <div>Chargement...</div>
        ) : (
          <>
            <SlotForm disabledDays={disabledDays} />
            <SlotList slots={slots || []} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
