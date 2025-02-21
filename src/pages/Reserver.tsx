import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircuitCard } from "@/components/reservation/CircuitCard";
import { FAQ } from "@/components/reservation/FAQ";
import { useReservation } from "@/hooks/useReservation";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";
import { SlotList } from "@/components/reservation/SlotList";
import { PilotSelection } from "@/components/reservation/PilotSelection";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";
import motocrossImage from "/images_reserver/reserver_motocross.webp";
import supercrossImage from "/images_reserver/reserver_supercross.webp";

const ToastContent = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div>
        <p>Votre réservation a bien été enregistrée.</p>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>• Règlement : Le paiement se fera sur place</p>
        <p>• Gestion : Vous pouvez consulter et annuler vos réservations depuis votre compte</p>
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate("/account")}
      >
        Voir mes réservations
      </Button>
    </div>
  );
};

const Reserver = () => {
  const navigate = useNavigate();
  const {
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
  } = useReservation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    
    if (success) {
      toast({
        title: "✅ Réservation confirmée",
        description: <ToastContent />,
        duration: 5000,
      });
    }
  };

  if (!user) {
    toast({
      title: "Connexion requise",
      description: "Vous devez être connecté pour accéder à la page de réservation.",
      action: (
        <ToastAction altText="Se connecter" onClick={() => navigate("/auth")}>
          Se connecter
        </ToastAction>
      ),
      duration: 5000,
    });
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <ReservationHeader />

        <div className="max-w-4xl mx-auto">
          <form onSubmit={onSubmit} className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Sélectionnez votre date</h2>
              <SlotList 
                slots={slotsWithBookings || []}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                isLoading={isLoading}
              />
            </div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Choisissez votre circuit</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <CircuitCard
                      title="Circuit Motocross"
                      description="Un circuit motocross technique avec des obstacles variés."
                      image={motocrossImage}
                      isSelected={circuit === "motocross"}
                      onClick={() => {
                        const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                        if (selectedSlot && selectedSlot.circuit_1_available > 0) {
                          setCircuit("motocross");
                        } else {
                          toast({
                            title: "Circuit complet",
                            description: "Il n'y a plus de places disponibles sur ce circuit.",
                            duration: 5000,
                          });
                        }
                      }}
                      availablePlaces={slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0}
                      features={[
                        "Longueur : 1920 mètres",
                        "Obstacles naturels et artificiels",
                        "Grandes montées et descentes",
                        "Pour pilotes expérimentés"
                      ]}
                    />

                    <CircuitCard
                      title="Circuit Supercross"
                      description="Un circuit supercross avec des enchainements rapides et techniques."
                      image={supercrossImage}
                      isSelected={circuit === "supercross"}
                      onClick={() => {
                        const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                        if (selectedSlot && selectedSlot.circuit_2_available > 0) {
                          setCircuit("supercross");
                        } else {
                          toast({
                            title: "Circuit complet",
                            description: "Il n'y a plus de places disponibles sur ce circuit.",
                            duration: 5000,
                          });
                        }
                      }}
                      availablePlaces={slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0}
                      features={[
                        "Longueur : 590 mètres",
                        "Sauts et whoops techniques",
                        "Sections rythmiques",
                        "Pour pilotes expérimentés"
                      ]}
                    />
                  </div>
                </div>

                {circuit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Nombre de pilotes</h2>
                        <p className="text-sm text-muted-foreground">
                          {circuit === "motocross" ? 
                            `${slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0} places disponibles` :
                            `${slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0} places disponibles`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <PilotSelection
                          value={numberOfPilots}
                          onChange={setNumberOfPilots}
                          maxPilots={
                            circuit === "motocross"
                              ? slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_1_available || 0
                              : slotsWithBookings?.find(slot => slot.date === selectedDate)?.circuit_2_available || 0
                          }
                        />
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full md:w-auto"
                          disabled={isSubmitting || hasExistingBooking}
                        >
                          {isSubmitting ? "Réservation en cours..." : hasExistingBooking ? "Réservation existante" : "Réserver"}
                        </Button>
                      </div>
                    </div>
                    {hasExistingBooking && (
                      <div className="mt-2 text-red-500 text-sm">
                        Vous avez déjà une réservation en cours pour ce créneau
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </form>
        </div>

        <div className="max-w-4xl mx-auto mt-24">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default Reserver;
