import React from "react";
import { Message } from "@/types/messages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge, Button } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Trash2 } from "lucide-react";

interface MessagesTableProps {
  messages: Message[];
  onMessageSelect: (message: Message) => void;
  onDeleteClick: (id: string) => void;
}

export const MessagesTable: React.FC<MessagesTableProps> = ({
  messages,
  onMessageSelect,
  onDeleteClick,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <TableRow key={message.id}>
            <TableCell>
              {format(new Date(message.created_at), "dd/MM/yyyy", {
                locale: fr,
              })}
            </TableCell>
            <TableCell>{message.full_name}</TableCell>
            <TableCell>{message.email}</TableCell>
            <TableCell className="max-w-xs truncate">{message.message}</TableCell>
            <TableCell>
              <Badge variant={message.status === "replied" ? "secondary" : "outline"}>
                {message.status === "replied" ? "Répondu" : "En attente"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMessageSelect(message)}
                >
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteClick(message.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
