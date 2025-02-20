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
    <>
      {/* Vue mobile et tablette */}
      <div className="md:hidden space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{message.full_name}</h3>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
              <Badge 
                variant={message.status === "replied" ? "default" : "secondary"}
                className={message.status === "replied" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
              >
                {message.status === "replied" ? "Répondu" : "En attente"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(message.created_at), "dd/MM/yyyy", {
                locale: fr,
              })}
            </div>
            <p className="text-sm">{message.message}</p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessageSelect(message)}
                className="flex-1"
              >
                Répondre
              </Button>
              <button
                onClick={() => onDeleteClick(message.id)}
                className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vue desktop */}
      <div className="hidden md:block">
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
                  <Badge 
                    variant={message.status === "replied" ? "default" : "secondary"}
                    className={message.status === "replied" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}
                  >
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
                      Répondre
                    </Button>
                    <button
                      onClick={() => onDeleteClick(message.id)}
                      className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
