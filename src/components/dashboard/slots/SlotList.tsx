import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface SlotListProps {
  slots: any[];
}

export const SlotList = ({ slots }: SlotListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeletingSlot, setIsDeletingSlot] = useState(false);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const handleDeleteSlot = async (slotId: string) => {
    setIsDeletingSlot(true);
    try {
      const { error } = await supabase
        .from("slots")
        .delete()
        .eq("id", slotId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le créneau et ses réservations ont été supprimés",
      });
      
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
      setIsDeletingSlot(false);
    }
  };

  const handleUpdateDate = async (slotId: string) => {
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingDate(true);
    try {
      const { error } = await supabase
        .from("slots")
        .update({ 
          date: format(selectedDate, "yyyy-MM-dd"),
          updated_at: new Date().toISOString()
        })
        .eq("id", slotId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La date du créneau a été mise à jour",
      });

      setSelectedDate(undefined);
      setSelectedSlotId(null);
      
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
      setIsUpdatingDate(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4">Créneaux existants</h3>
      <div className="grid gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">
                {format(new Date(slot.date), "dd MMMM yyyy", { locale: fr })}
              </p>
              <p className="text-sm text-muted-foreground">
                Circuit motocross : {slot.circuit_1_available} places disponibles sur {slot.circuit_1_capacity} | 
                Circuit supercross : {slot.circuit_2_available} places disponibles sur {slot.circuit_2_capacity}
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className="transition-transform hover:scale-110"
                  >
                    <Calendar className="h-5 w-5 text-secondary" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier la date</DialogTitle>
                    <DialogDescription>
                      Sélectionnez une nouvelle date pour ce créneau. Les réservations existantes seront conservées.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={fr}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate(undefined);
                        setSelectedSlotId(null);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={() => handleUpdateDate(slot.id)}
                      disabled={!selectedDate || isUpdatingDate}
                    >
                      Confirmer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSlot(slot.id)}
                disabled={isDeletingSlot}
                className="transition-transform hover:scale-110"
              >
                <Trash2 className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
