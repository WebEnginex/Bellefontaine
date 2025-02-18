import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PilotSelectionProps {
  numberOfPilots: string;
  onNumberOfPilotsChange: (value: string) => void;
}

export const PilotSelection = ({ numberOfPilots, onNumberOfPilotsChange }: PilotSelectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Nombre de pilotes</h2>
      <Select value={numberOfPilots} onValueChange={onNumberOfPilotsChange}>
        <SelectTrigger className="w-full max-w-xs bg-white">
          <SelectValue placeholder="Sélectionnez le nombre de pilotes" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-white">
          {[1, 2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? "pilote" : "pilotes"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
