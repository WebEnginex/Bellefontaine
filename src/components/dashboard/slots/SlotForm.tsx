import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

interface SlotFormProps {
  disabledDays: Date[];
}

export const SlotForm = ({ disabledDays }: SlotFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [circuit1Capacity, setCircuit1Capacity] = useState("10");
  const [circuit2Capacity, setCircuit2Capacity] = useState("10");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSlot = async () => {
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const circuit1CapacityNum = parseInt(circuit1Capacity);
      const circuit2CapacityNum = parseInt(circuit2Capacity);

      const { error } = await supabase.from("slots").insert({
        date: formattedDate,
        circuit_1_capacity: circuit1CapacityNum,
        circuit_2_capacity: circuit2CapacityNum,
        circuit_1_available: circuit1CapacityNum,
        circuit_2_available: circuit2CapacityNum,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le créneau a été créé avec succès",
      });

      setSelectedDate(undefined);
      setCircuit1Capacity("10");
      setCircuit2Capacity("10");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["slots"] }),
        queryClient.refetchQueries({ queryKey: ["slots"] })
      ]);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-medium">Sélectionnez une date</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabledDays}
          locale={fr}
        />
        {selectedDate && (
          <p className="text-sm text-muted-foreground">
            Date sélectionnée : {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="circuit1" className="font-medium">
            Places circuit motocross
          </label>
          <Input
            id="circuit1"
            type="number"
            min="0"
            value={circuit1Capacity}
            onChange={(e) => setCircuit1Capacity(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="circuit2" className="font-medium">
            Places circuit supercross
          </label>
          <Input
            id="circuit2"
            type="number"
            min="0"
            value={circuit2Capacity}
            onChange={(e) => setCircuit2Capacity(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleCreateSlot} 
        disabled={!selectedDate || isSubmitting}
      >
        Créer le créneau
      </Button>
    </div>
  );
};
