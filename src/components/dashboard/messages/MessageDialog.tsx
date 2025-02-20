import React from "react";
import { Message } from "@/types/messages";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Textarea,
} from "@/components/ui";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageDialogProps {
  open: boolean;
  message: Message | null;
  replyText: string;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onReplyTextChange: (text: string) => void;
  onSubmit: () => void;
}

export const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  message,
  replyText,
  submitting,
  onOpenChange,
  onReplyTextChange,
  onSubmit,
}) => {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message de {message.full_name}</DialogTitle>
          <DialogDescription>
            Reçu le {format(new Date(message.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Message original :</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>

          {message.admin_response && (
            <div>
              <h4 className="font-medium mb-2">Réponse précédente :</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{message.admin_response}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Votre réponse :</h4>
            <Textarea
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
