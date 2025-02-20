import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReservationConfirmationProps {
  id: string | number;
}

export const ReservationConfirmation = ({ id }: ReservationConfirmationProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-[400px] bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">✅ Réservation confirmée</h3>
          <p className="text-gray-600">Votre réservation a bien été enregistrée.</p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Règlement : Le paiement se fera sur place</p>
          <p>• Gestion : Vous pouvez consulter et annuler vos réservations depuis votre compte</p>
          <p>• Annulation : Si vous devez annuler, utilisez la page "Mon compte"</p>
        </div>

        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate("/account")}
        >
          Gérer mes réservations
        </Button>
      </div>
    </div>
  );
};
