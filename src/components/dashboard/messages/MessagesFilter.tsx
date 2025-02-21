import React from "react";
import { MessageStatus } from "@/types/messages";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessagesFilterProps {
  filters: {
    status: MessageStatus | null;
    text: string;
  };
  onFiltersChange: (filters: { status: MessageStatus | null; text: string }) => void;
}

export const MessagesFilter: React.FC<MessagesFilterProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Rechercher un message..."
          value={filters.text}
          onChange={(e) =>
            onFiltersChange({ ...filters, text: e.target.value })
          }
          className="w-full"
        />
      </div>
      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value === "all" ? null : (value as MessageStatus),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="unread">Non lu</SelectItem>
          <SelectItem value="read">Lu</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="replied">Répondu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
