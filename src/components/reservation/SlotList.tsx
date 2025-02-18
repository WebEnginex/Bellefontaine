import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SlotListProps {
  slots: any[];
  selectedDate: string | undefined;
  onSelectDate: (date: string) => void;
  isLoading: boolean;
}

export const SlotList = ({ slots, selectedDate, onSelectDate, isLoading }: SlotListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement des créneaux...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Aucun créneau disponible
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4"
    >
      {slots.map((slot) => (
        <Card
          key={slot.id}
          className={`p-6 cursor-pointer transition-all duration-300 ${
            selectedDate === slot.date
              ? "border-primary shadow-md"
              : "hover:border-gray-300 hover:shadow-lg"
          }`}
          onClick={() => onSelectDate(slot.date)}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold text-lg">
                {format(new Date(slot.date), "dd MMMM yyyy", { locale: fr })}
              </p>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>14h00 - 18h00</span>
              </div>
            </div>
            <div className="space-y-1 md:text-right">
              <p className="text-gray-600">
                Circuit motocross : <span className="font-medium">{slot.circuit_1_available} places</span>
              </p>
              <p className="text-gray-600">
                Circuit supercross : <span className="font-medium">{slot.circuit_2_available} places</span>
              </p>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
};
