import React from "react";
import { Booking } from "@/types/bookings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button, Card } from "@/components/ui";
import { Check, X, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BookingsListProps {
  circuitNumber: number;
}

export const BookingsList = ({ circuitNumber }: BookingsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookingToDelete, setBookingToDelete] = React.useState<string | null>(null);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings", circuitNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          slot:slots!slot_id(*),
          profile:profiles!user_id(*)
        `)
        .eq("circuit_number", circuitNumber)
        .order("slot(date)", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des réservations:", error);
        throw error;
      }

      return data as Booking[];
    },
  });

  const handleUpdatePaymentStatus = async (bookingId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "paid" ? "pending" : "paid";
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Le statut de paiement a été ${newStatus === "paid" ? "confirmé" : "annulé"}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingToDelete);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La réservation a été annulée",
      });
      
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setBookingToDelete(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-500">
          Erreur lors du chargement des réservations : {(error as Error).message}
        </p>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Aucune réservation trouvée
        </p>
      </Card>
    );
  }

  // Grouper les réservations par date de créneau
  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = booking.slot?.date || "Date inconnue";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedBookings).map(([date, dateBookings]) => (
          <div key={date} className="space-y-4">
            <h2 className="text-lg font-semibold">
              {date !== "Date inconnue" 
                ? format(new Date(date), "EEEE d MMMM yyyy", { locale: fr })
                : date}
            </h2>
            <div className="grid gap-4">
              {dateBookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-medium">
                        {booking.profile?.first_name} {booking.profile?.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.number_of_pilots} pilote{booking.number_of_pilots > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.payment_status === "paid" ? (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdatePaymentStatus(booking.id, booking.payment_status)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4 text-gray-700" />
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => handleUpdatePaymentStatus(booking.id, booking.payment_status)}
                          className="h-8 w-8 bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-red-500 hover:bg-red-50"
                        onClick={() => setBookingToDelete(booking.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
