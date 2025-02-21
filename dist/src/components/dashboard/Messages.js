import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui";
import { MessagesTable } from "./messages/MessagesTable";
import { MessageDialog } from "./messages/MessageDialog";
import { DeleteConfirmDialog } from "./messages/DeleteConfirmDialog";
import { MessagesFilter } from "./messages/MessagesFilter";
const Messages = () => {
    const [state, setState] = useState({
        replyText: {},
        submitting: {},
        selectedMessage: null,
        deleteConfirmOpen: false,
        messageToDelete: null,
        filters: {
            status: null,
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
            if (error)
                throw error;
            // Convertir les messages en ajoutant le bon statut
            return data.map(message => ({
                ...message,
                status: message.read
                    ? message.status === "replied"
                        ? "replied"
                        : "pending"
                    : "unread"
            }));
        },
    });
    const handleMessageSelect = async (message) => {
        setState(prev => ({
            ...prev,
            selectedMessage: message,
        }));
        // Marquer le message comme lu s'il ne l'est pas déjà
        if (!message.read) {
            try {
                const { error } = await supabase
                    .from("contact_messages")
                    .update({
                    read: true,
                    status: message.admin_response ? "replied" : "pending"
                })
                    .eq("id", message.id)
                    .select()
                    .single();
                if (error) {
                    console.error("Erreur lors de la mise à jour du message:", error);
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: "Impossible de marquer le message comme lu",
                    });
                }
                else {
                    refetch();
                }
            }
            catch (err) {
                console.error("Erreur lors de la mise à jour du message:", err);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de marquer le message comme lu",
                });
            }
        }
    };
    const handleReplyTextChange = (text) => {
        if (!state.selectedMessage)
            return;
        setState(prev => ({
            ...prev,
            replyText: {
                ...prev.replyText,
                [state.selectedMessage?.id || ""]: text,
            },
        }));
    };
    const handleReplySubmit = async () => {
        if (!state.selectedMessage)
            return;
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
            // Mettre à jour la base de données
            const { error: dbError } = await supabase
                .from("contact_messages")
                .update({
                admin_response: replyText,
                status: "replied",
                read: true
            })
                .eq("id", messageId)
                .select()
                .single();
            if (dbError) {
                throw dbError;
            }
            // Envoyer l'email via notre serveur Express
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: state.selectedMessage.email,
                    templateId: 'd-836eba9453584f04a390bfadc624ea8b',
                    dynamicTemplateData: {
                        to_name: state.selectedMessage.full_name || 'Client',
                        message: replyText
                    }
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            toast({
                title: "Succès",
                description: "Réponse envoyée avec succès",
            });
            refetch();
        }
        catch (err) {
            console.error("Erreur lors de l'envoi de la réponse:", err);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'envoyer la réponse",
            });
        }
        finally {
            setState(prev => ({
                ...prev,
                submitting: { ...prev.submitting, [messageId]: false },
                selectedMessage: null,
                replyText: {},
            }));
        }
    };
    const handleDeleteClick = (id) => {
        setState(prev => ({
            ...prev,
            deleteConfirmOpen: true,
            messageToDelete: id,
        }));
    };
    const handleDeleteConfirm = async () => {
        if (!state.messageToDelete)
            return;
        const { error } = await supabase
            .from("contact_messages")
            .delete()
            .eq("id", state.messageToDelete);
        setState(prev => ({
            ...prev,
            deleteConfirmOpen: false,
            messageToDelete: null,
        }));
        if (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de supprimer le message",
            });
        }
        else {
            toast({
                title: "Succès",
                description: "Message supprimé avec succès",
            });
            refetch();
        }
    };
    const handleDeleteCancel = () => {
        setState(prev => ({
            ...prev,
            deleteConfirmOpen: false,
            messageToDelete: null,
        }));
    };
    const filteredMessages = messages?.filter(message => {
        if (state.filters.status && message.status !== state.filters.status) {
            return false;
        }
        if (state.filters.text) {
            const searchText = state.filters.text.toLowerCase();
            return (message.full_name.toLowerCase().includes(searchText) ||
                message.email.toLowerCase().includes(searchText) ||
                message.message.toLowerCase().includes(searchText));
        }
        return true;
    });
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Messages de contact" }) }), _jsxs(CardContent, { children: [_jsx(MessagesFilter, { filters: state.filters, onFiltersChange: (filters) => setState((prev) => ({ ...prev, filters })) }), _jsx("div", { className: "mt-6", children: _jsx(MessagesTable, { messages: filteredMessages || [], onMessageSelect: handleMessageSelect, onDeleteClick: handleDeleteClick }) })] }), _jsx(MessageDialog, { open: !!state.selectedMessage, message: state.selectedMessage, replyText: state.selectedMessage
                    ? state.replyText[state.selectedMessage.id] || ""
                    : "", submitting: state.selectedMessage
                    ? state.submitting[state.selectedMessage.id] || false
                    : false, onReplyTextChange: handleReplyTextChange, onSubmit: handleReplySubmit, onOpenChange: (open) => {
                    if (!open)
                        setState((prev) => ({ ...prev, selectedMessage: null }));
                } }), _jsx(DeleteConfirmDialog, { open: state.deleteConfirmOpen, onConfirm: handleDeleteConfirm, onOpenChange: handleDeleteCancel })] }));
};
export default Messages;
