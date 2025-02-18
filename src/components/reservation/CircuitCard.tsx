import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CircuitCardProps {
  title: string;
  description: string;
  image: string;
  isSelected: boolean;
  onClick: () => void;
  availablePlaces: number;
  features: string[];
}

export const CircuitCard = ({ 
  title, 
  description, 
  image, 
  isSelected, 
  onClick,
  availablePlaces,
  features
}: CircuitCardProps) => (
  <Card
    className={`cursor-pointer overflow-hidden transition-all duration-300 ${
      isSelected ? "ring-2 ring-primary" : "hover:shadow-lg"
    }`}
    onClick={onClick}
  >
    <div className="h-48 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-white text-sm mt-1">
          {availablePlaces} places disponibles
        </p>
      </div>
    </div>
    <div className="p-4">
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <Info className="h-4 w-4 mr-2 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </Card>
);
