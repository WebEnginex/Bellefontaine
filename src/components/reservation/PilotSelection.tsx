import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PilotSelectionProps {
  value: string;
  onChange: (value: string) => void;
  maxPilots: number;
}

export const PilotSelection = ({ value, onChange, maxPilots }: PilotSelectionProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-[200px] bg-white">
        <SelectValue placeholder="Nombre de pilotes" />
      </SelectTrigger>
      <SelectContent position="popper" className="bg-white">
        {Array.from({ length: Math.min(maxPilots, 5) }, (_, i) => i + 1).map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num} {num === 1 ? "pilote" : "pilotes"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
