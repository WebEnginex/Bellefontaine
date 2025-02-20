import React from "react";
import { Input } from "@/components/ui";
import { Search } from "lucide-react";

interface MessagesFilterProps {
  filters: {
    read: boolean | null;
    replied: boolean | null;
    text: string;
  };
  onFilterChange: (text: string) => void;
  onReadFilterChange: (read: boolean | null) => void;
  onRepliedFilterChange: (replied: boolean | null) => void;
}

export const MessagesFilter: React.FC<MessagesFilterProps> = ({
  filters,
  onFilterChange,
  onReadFilterChange,
  onRepliedFilterChange,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Rechercher un message..."
        value={filters.text}
        onChange={(e) => onFilterChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
