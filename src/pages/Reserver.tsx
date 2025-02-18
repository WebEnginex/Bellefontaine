import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircuitCard } from "@/components/reservation/CircuitCard";
import { FAQ } from "@/components/reservation/FAQ";
import { useReservation } from "@/hooks/useReservation";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";
import { SlotList } from "@/components/reservation/SlotList";
import { PilotSelection } from "@/components/reservation/PilotSelection";
import { ReservationConfirmation } from "@/components/reservation/ReservationConfirmation";

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
      toast.custom((id) => <ReservationConfirmation id={id} />, {
        position: "top-center",
        duration: 10000,
      });
    }
  };

  if (!user) {
    toast("Connexion requise", {
      description: "Vous devez être connecté pour accéder à la page de réservation.",
      action: {
        label: "Se connecter",
        onClick: () => navigate("/auth")
      }
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
                      image="https://cdn.pixabay.com/photo/2023/06/22/02/25/motocross-8080377_1280.jpg"
                      isSelected={circuit === "motocross"}
                      onClick={() => {
                        const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                        if (selectedSlot && selectedSlot.circuit_1_available > 0) {
                          setCircuit("motocross");
                        } else {
                          toast("Circuit complet", {
                            description: "Il n'y a plus de places disponibles sur ce circuit."
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
                      image="https://images.pexels.com/photos/217872/pexels-photo-217872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      isSelected={circuit === "supercross"}
                      onClick={() => {
                        const selectedSlot = slotsWithBookings?.find(slot => slot.date === selectedDate);
                        if (selectedSlot && selectedSlot.circuit_2_available > 0) {
                          setCircuit("supercross");
                        } else {
                          toast("Circuit complet", {
                            description: "Il n'y a plus de places disponibles sur ce circuit."
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
                  <PilotSelection 
                    numberOfPilots={numberOfPilots}
                    onNumberOfPilotsChange={setNumberOfPilots}
                  />
                )}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full max-w-md mx-auto block mt-12"
              disabled={isSubmitting || !selectedDate || !circuit || !numberOfPilots || hasExistingBooking}
            >
              {isSubmitting ? "Réservation en cours..." : hasExistingBooking ? "Vous avez déjà réservé ce créneau" : "Réserver"}
            </Button>
          </form>

          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default Reserver;
