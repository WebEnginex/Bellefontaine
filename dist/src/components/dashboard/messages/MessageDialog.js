import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Textarea, } from "@/components/ui";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
export const MessageDialog = ({ open, message, replyText, submitting, onOpenChange, onReplyTextChange, onSubmit, }) => {
    if (!message)
        return null;
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "R\u00E9pondre au message" }), _jsxs(DialogDescription, { children: ["De : ", message.full_name, " (", message.email, ")", _jsx("br", {}), "Date :", " ", format(new Date(message.created_at), "dd/MM/yyyy HH:mm", {
                                    locale: fr,
                                })] })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Message :" }), _jsx("p", { className: "text-sm text-muted-foreground", children: message.message })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Votre r\u00E9ponse :" }), _jsx(Textarea, { value: replyText, onChange: (e) => onReplyTextChange(e.target.value), placeholder: "\u00C9crivez votre r\u00E9ponse ici...", className: "min-h-[100px]" })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Annuler" }), _jsx(Button, { onClick: onSubmit, disabled: submitting, children: submitting ? "Envoi en cours..." : "Envoyer" })] })] }) }));
};
