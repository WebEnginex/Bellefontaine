import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
} from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/supabase-client";
import { Database } from "@/lib/supabase/types";

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
  id: string;
  user_id: string;
  slot_id: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  slot: {
    date: string;
    start_time: string;
    end_time: string;
  };
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface BookingsListProps {
  circuitNumber: number;
}

export const BookingsList = ({ circuitNumber }: BookingsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeletingBooking, setIsDeletingBooking] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", circuitNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles (
            email,
            full_name
          ),
          slots (
            date
          )
        `)
        .eq("circuit_number", circuitNumber)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('bookings-list-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDeleteBooking = async (bookingId: string) => {
    setIsDeletingBooking(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La réservation a été supprimée",
      });
      
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeletingBooking(false);
    }
  };

  const handleUpdatePaymentStatus = async (bookingId: string, currentStatus: string) => {
    setIsUpdatingPayment(true);
    try {
      // Ensure we're using the exact string values that match the database constraint
      const newStatus = currentStatus === "paid" ? "pending" : "paid";
      
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: newStatus })
        .eq("id", bookingId);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      toast({
        title: "Succès",
        description: "Le statut du paiement a été mis à jour",
      });
      
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch (error: any) {
      console.error("Error in handleUpdatePaymentStatus:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleBookingAction = async (booking: Booking, action: 'confirm' | 'cancel') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: action === 'confirm' ? 'confirmed' : 'cancelled',
          updated_at: new Date().toISOString()
        } as Database['public']['Tables']['bookings']['Update'])
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: `Réservation ${action === 'confirm' ? 'confirmée' : 'annulée'}`,
        description: `La réservation a été ${action === 'confirm' ? 'confirmée' : 'annulée'} avec succès.`,
      });

      queryClient.invalidateQueries({ queryKey: ['bookings'] } as InvalidateQueryFilters);
    } catch (error: any) {
      console.error(`Erreur lors de la ${action === 'confirm' ? 'confirmation' : 'annulation'} de la réservation:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Réservations {circuitNumber === 1 ? "Motocross" : "Supercross"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Chargement...</div>
        ) : !bookings || bookings.length === 0 ? (
          <p className="text-muted-foreground">Aucune réservation trouvée.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        {booking.profiles?.full_name || booking.profiles?.email}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Date : {format(new Date(booking.slots.date), "dd MMMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nombre de pilotes : {booking.number_of_pilots}
                      </p>
                      <div className="mt-2">
                        <Badge 
                          className={`${
                            booking.payment_status === "paid" 
                              ? "bg-success text-white" 
                              : "bg-[#8E9196] text-white"
                          }`}
                        >
                          Paiement : {booking.payment_status === "paid" ? "Payé" : "En attente"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdatePaymentStatus(booking.id, booking.payment_status)}
                        disabled={isUpdatingPayment}
                      >
                        {booking.payment_status === "paid" ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeletingBooking}
                            className="hover:bg-transparent"
                          >
                            <Trash2 className="h-4 w-4 text-primary" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBooking(booking.id)}
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
