import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/messages";
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { MessagesTable } from "./messages/MessagesTable";
import { MessageDialog } from "./messages/MessageDialog";
import { DeleteConfirmDialog } from "./messages/DeleteConfirmDialog";
import { MessagesFilter } from "./messages/MessagesFilter";

type MessagesState = {
  replyText: { [key: string]: string };
  submitting: { [key: string]: boolean };
  selectedMessage: Message | null;
  deleteConfirmOpen: boolean;
  messageToDelete: string | null;
  filters: {
    read: boolean | null;
    replied: boolean | null;
    text: string;
  };
};

const Messages = () => {
  const [state, setState] = useState<MessagesState>({
    replyText: {},
    submitting: {},
    selectedMessage: null,
    deleteConfirmOpen: false,
    messageToDelete: null,
    filters: {
      read: null,
      replied: null,
      text: "",
    },
  });

  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const handleMessageSelect = async (message: Message) => {
    setState(prev => ({
      ...prev,
      selectedMessage: message,
    }));
  };

  const handleReplyTextChange = (text: string) => {
    if (!state.selectedMessage) return;
    setState(prev => ({
      ...prev,
      replyText: {
        ...prev.replyText,
        [state.selectedMessage?.id || ""]: text,
      },
    }));
  };

  const handleReplySubmit = async () => {
    if (!state.selectedMessage) return;
    
    const messageId = state.selectedMessage.id;
    const replyText = state.replyText[messageId];

    if (!replyText?.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La réponse ne peut pas être vide",
      });
      return;
    }

    setState(prev => ({
      ...prev,
      submitting: { ...prev.submitting, [messageId]: true },
    }));

    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({
          admin_response: replyText,
          status: "replied",
        })
        .eq("id", messageId);

      if (error) throw error;

      toast({
        title: "Réponse envoyée",
        description: "La réponse a été enregistrée avec succès",
      });

      await refetch();

      setState(prev => ({
        ...prev,
        selectedMessage: null,
        replyText: { ...prev.replyText, [messageId]: "" },
        submitting: { ...prev.submitting, [messageId]: false },
      }));

    } catch (error: any) {
      console.error("Error sending reply:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse",
      });

      setState(prev => ({
        ...prev,
        submitting: { ...prev.submitting, [messageId]: false },
      }));
    }
  };

  const handleDeleteClick = (id: string) => {
    setState(prev => ({
      ...prev,
      messageToDelete: id,
      deleteConfirmOpen: true,
    }));
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });

      setState(prev => ({
        ...prev,
        deleteConfirmOpen: false,
        messageToDelete: null,
      }));

      await refetch();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const handleMessageDialogOpenChange = (open: boolean) => {
    if (!open) {
      setState(prev => ({
        ...prev,
        selectedMessage: null,
      }));
    }
  };

  const handleFilterChange = (text: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, text },
    }));
  };

  const handleReadFilterChange = (read: boolean | null) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, read },
    }));
  };

  const handleRepliedFilterChange = (replied: boolean | null) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, replied },
    }));
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span>Messages de contact</span>
          <MessagesFilter
            filters={state.filters}
            onFilterChange={handleFilterChange}
            onReadFilterChange={handleReadFilterChange}
            onRepliedFilterChange={handleRepliedFilterChange}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <MessagesTable
            messages={messages || []}
            onMessageSelect={handleMessageSelect}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </CardContent>

      <MessageDialog
        open={!!state.selectedMessage}
        message={state.selectedMessage}
        replyText={state.replyText[state.selectedMessage?.id || ""] || ""}
        onReplyTextChange={handleReplyTextChange}
        onSubmit={handleReplySubmit}
        submitting={state.submitting[state.selectedMessage?.id || ""] || false}
        onOpenChange={handleMessageDialogOpenChange}
      />

      <DeleteConfirmDialog
        open={state.deleteConfirmOpen}
        onOpenChange={(open) => setState(prev => ({ ...prev, deleteConfirmOpen: open }))}
        onConfirm={() => state.messageToDelete && handleDeleteMessage(state.messageToDelete)}
      />
    </Card>
  );
};

export default Messages;
