import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui";
export const DeleteConfirmDialog = ({ open, onOpenChange, onConfirm, }) => {
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Supprimer le message" }), _jsx(AlertDialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir supprimer ce message ? Cette action est irr\u00E9versible." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Annuler" }), _jsx(AlertDialogAction, { onClick: onConfirm, className: "bg-red-500 hover:bg-red-600", children: "Supprimer" })] })] }) }));
};
