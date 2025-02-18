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
  CardDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { MessagesTable } from "./messages/MessagesTable";
import { MessageDialog } from "./messages/MessageDialog";
import { DeleteConfirmDialog } from "./messages/DeleteConfirmDialog";
import { MessagesFilter } from "./messages/MessagesFilter";

type SortField = "date" | "status" | "name";
type SortOrder = "asc" | "desc";

interface MessagesState {
  replyText: { [key: string]: string };
  submitting: { [key: string]: boolean };
  selectedMessage: Message | null;
  deleteConfirmOpen: boolean;
  messageToDelete: string | null;
  sortField: SortField;
  sortOrder: SortOrder;
  filters: {
    read: boolean | null;
    replied: boolean | null;
    text: string;
  };
}

const Messages = () => {
  const [replyText, setReplyText] = useState<MessagesState["replyText"]>({});
  const [submitting, setSubmitting] = useState<MessagesState["submitting"]>({});
  const [selectedMessage, setSelectedMessage] = useState<MessagesState["selectedMessage"]>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<MessagesState["deleteConfirmOpen"]>(false);
  const [messageToDelete, setMessageToDelete] = useState<MessagesState["messageToDelete"]>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filters, setFilters] = useState<MessagesState["filters"]>({
    read: null,
    replied: null,
    text: "",
  });
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["contact-messages", sortField, sortOrder, filters],
    queryFn: async () => {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order(
          sortField === "date"
            ? "created_at"
            : sortField === "name"
            ? "full_name"
            : "status",
          { ascending: sortOrder === "asc" }
        );

      if (filters.read !== null) {
        query = query.eq("read", filters.read);
      }
      if (filters.replied !== null) {
        query = query.eq("status", filters.replied ? "replied" : "pending");
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Message[];
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleMessageSelect = async (message: Message) => {
    if (!message.read) {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", message.id);

      if (error) {
        console.error("Error marking message as read:", error);
      } else {
        refetch();
      }
    }
    setSelectedMessage(message);
  };

  const handleReplyTextChange = (text: string) => {
    setReplyText((prev) => ({
      ...prev,
      [selectedMessage?.id || ""]: text,
    }));
  };

  const handleReplySubmit = async () => {
    if (!replyText[selectedMessage?.id || ""]?.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La réponse ne peut pas être vide",
      });
      return;
    }

    setSubmitting((prev) => ({ ...prev, [selectedMessage?.id || ""]: true }));
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({
          admin_response: replyText[selectedMessage?.id || ""],
          status: "replied",
        })
        .eq("id", selectedMessage?.id);

      if (error) throw error;

      toast({
        title: "Réponse envoyée",
        description: "La réponse a été enregistrée avec succès",
      });
      await refetch();
      setReplyText((prev) => ({ ...prev, [selectedMessage?.id || ""]: "" }));
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse",
      });
    } finally {
      setSubmitting((prev) => ({ ...prev, [selectedMessage?.id || ""]: false }));
    }
  };

  const handleDeleteClick = (id: string) => {
    setMessageToDelete(id);
    setDeleteConfirmOpen(true);
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

      // Fermer la boîte de dialogue de confirmation
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
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
      setSelectedMessage(null);
    }
  };

  const handleFilterChange = (text: string) => {
    setFilters((prev) => ({ ...prev, text }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages de contact</h2>
        <MessagesFilter 
          value={filters.text}
          onChange={handleFilterChange}
        />
      </div>

      <MessagesTable
        messages={messages || []}
        onMessageSelect={handleMessageSelect}
        onDeleteClick={handleDeleteClick}
      />

      <MessageDialog
        message={selectedMessage}
        replyText={replyText[selectedMessage?.id || ""] || ""}
        submitting={submitting[selectedMessage?.id || ""]}
        onOpenChange={handleMessageDialogOpenChange}
        onReplyChange={handleReplyTextChange}
        onReplySubmit={handleReplySubmit}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => messageToDelete && handleDeleteMessage(messageToDelete)}
      />
    </div>
  );
};

export default Messages;
