import React from "react";
import { Input } from "@/components/ui";
import { Search } from "lucide-react";

interface MessagesFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const MessagesFilter: React.FC<MessagesFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Rechercher un message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
