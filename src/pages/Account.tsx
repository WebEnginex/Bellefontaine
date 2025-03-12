import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays, differenceInHours, isSameDay, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Clock, User, Mail, UserCircle, AlertCircle } from "lucide-react";
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
import { useState } from "react";

export default function Account() {
  const { user } = useAuth();
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: bookings, refetch } = useQuery({
    queryKey: ["user-bookings", user?.id],
    queryFn: async () => {
      const now = new Date();
      console.log("Date actuelle:", now);
      console.log("User ID:", user?.id);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          slots (
            *
          )
        `)
        .eq("user_id", user?.id)
        .order("slots(date)", { ascending: true });

      if (error) {
        console.error("Erreur lors de la requête:", error);
        throw error;
      }

      console.log("Réservations reçues:", data);

      // Filtrer les réservations dont la date est passée
      const filteredBookings = data.filter(booking => {
        if (!booking.slots?.date) {
          console.log("Réservation sans date:", booking);
          return false;
        }
        const slotDate = new Date(booking.slots.date);
        console.log("Date du créneau:", slotDate);
        return slotDate >= now;
      });

      console.log("Réservations filtrées:", filteredBookings);
      return filteredBookings;
    },
    enabled: !!user?.id,
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        console.error("Error deleting booking:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'annulation",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
      refetch();
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'annulation",
        variant: "destructive",
      });
    } finally {
      setBookingToDelete(null);
    }
  };

  const getCircuitName = (number: number) =>
    number === 1 ? "Motocross" : "Supercross";

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Mon compte</h1>

      <div className="space-y-4 md:space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
              <UserCircle className="h-6 w-6" />
              Mon profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Prénom</p>
                  <p className="text-muted-foreground">{profile?.first_name || "Non renseigné"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Nom</p>
                  <p className="text-muted-foreground">{profile?.last_name || "Non renseigné"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Email</p>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2 pt-2 border-t">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Pour modifier vos informations, veuillez nous contacter via le formulaire de contact.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Mes réservations</CardTitle>
          </CardHeader>
          <CardContent>
            {!bookings || bookings.length === 0 ? (
              <p className="text-muted-foreground">
                Vous n'avez pas encore de réservation.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-base md:text-lg">
                            Circuit : {getCircuitName(booking.circuit_number)}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Date :{" "}
                              {format(
                                new Date(booking.slots.date),
                                "d MMMM yyyy",
                                { locale: fr }
                              )}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>30h30 - 18h00</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Nombre de pilotes : {booking.number_of_pilots}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Statut : vérifié
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Paiement : sur place
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => setBookingToDelete(booking.id)}
                          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
                        >
                          Annuler ma réservation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
              {bookingToDelete && bookings?.find(b => b.id === bookingToDelete)?.slots?.date && (
                <p className="text-yellow-600 dark:text-yellow-500">
                  {getBookingWarningMessage(bookings.find(b => b.id === bookingToDelete)?.slots.date)}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Cette action est irréversible.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookingToDelete && handleCancelBooking(bookingToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getBookingWarningMessage(bookingDate: string) {
  const today = new Date();
  const reservationDate = new Date(bookingDate);
  // Set the reservation time to 14:00
  const reservationDateTime = setMinutes(setHours(reservationDate, 14), 0);
  const daysUntilReservation = differenceInDays(reservationDateTime, today);
  const hoursUntilReservation = differenceInHours(reservationDateTime, today);

  if (isSameDay(today, reservationDate)) {
    return "⚠️ Attention : Vous annulez une réservation pour aujourd'hui. Cette annulation tardive peut impacter l'organisation.";
  } else if (daysUntilReservation < 1) {
    return `⚠️ Attention : Vous annulez une réservation prévue dans ${hoursUntilReservation} heure${hoursUntilReservation > 1 ? 's' : ''}.`;
  } else if (daysUntilReservation <= 2) {
    return `⚠️ Attention : Vous annulez une réservation prévue dans ${daysUntilReservation} jour${daysUntilReservation > 1 ? 's' : ''}.`;
  }
  return null;
}
