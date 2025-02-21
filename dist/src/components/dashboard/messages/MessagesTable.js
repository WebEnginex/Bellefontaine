import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { getStatusConfig } from "@/types/messages";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge, Button } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Trash2 } from "lucide-react";
export const MessagesTable = ({ messages, onMessageSelect, onDeleteClick, }) => {
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden space-y-4", children: messages.map((message) => {
                    const statusConfig = getStatusConfig(message.status);
                    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors", onClick: () => onMessageSelect(message), children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: message.full_name }), _jsx("p", { className: "text-sm text-muted-foreground", children: message.email })] }), _jsx(Badge, { variant: statusConfig.variant, className: statusConfig.className, children: statusConfig.label })] }), _jsx("div", { className: "text-sm text-muted-foreground", children: format(new Date(message.created_at), "dd/MM/yyyy", {
                                    locale: fr,
                                }) }), _jsx("p", { className: "text-sm", children: message.message }), _jsx("div", { className: "flex justify-end pt-2", children: _jsx(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                        e.stopPropagation();
                                        onDeleteClick(message.id);
                                    }, className: "text-red-500 hover:text-red-600", children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, message.id));
                }) }), _jsx("div", { className: "hidden md:block", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Date" }), _jsx(TableHead, { children: "Nom" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Message" }), _jsx(TableHead, { children: "Statut" }), _jsx(TableHead, { className: "w-[100px]", children: "Actions" })] }) }), _jsx(TableBody, { children: messages.map((message) => {
                                const statusConfig = getStatusConfig(message.status);
                                return (_jsxs(TableRow, { className: "cursor-pointer hover:bg-gray-50 transition-colors", onClick: () => onMessageSelect(message), children: [_jsx(TableCell, { children: format(new Date(message.created_at), "dd/MM/yyyy", {
                                                locale: fr,
                                            }) }), _jsx(TableCell, { children: message.full_name }), _jsx(TableCell, { children: message.email }), _jsx(TableCell, { className: "max-w-md truncate", children: message.message }), _jsx(TableCell, { children: _jsx(Badge, { variant: statusConfig.variant, className: statusConfig.className, children: statusConfig.label }) }), _jsx(TableCell, { children: _jsx(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                                    e.stopPropagation();
                                                    onDeleteClick(message.id);
                                                }, className: "text-red-500 hover:text-red-600", children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, message.id));
                            }) })] }) })] }));
};
