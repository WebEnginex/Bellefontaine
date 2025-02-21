import React from "react";
import { Message, getStatusConfig } from "@/types/messages";
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
        {messages.map((message) => {
          const statusConfig = getStatusConfig(message.status);
          return (
            <div
              key={message.id}
              className="bg-white rounded-lg shadow p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onMessageSelect(message)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{message.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
                <Badge 
                  variant={statusConfig.variant}
                  className={statusConfig.className}
                >
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(message.created_at), "dd/MM/yyyy", {
                  locale: fr,
                })}
              </div>
              <p className="text-sm">{message.message}</p>
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(message.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => {
              const statusConfig = getStatusConfig(message.status);
              return (
                <TableRow 
                  key={message.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onMessageSelect(message)}
                >
                  <TableCell>
                    {format(new Date(message.created_at), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{message.full_name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {message.message}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(message.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
