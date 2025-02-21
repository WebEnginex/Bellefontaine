import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/Select";
export const MessagesFilter = ({ filters, onFiltersChange, }) => {
    return (_jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { placeholder: "Rechercher un message...", value: filters.text, onChange: (e) => onFiltersChange({ ...filters, text: e.target.value }), className: "w-full" }) }), _jsxs(Select, { value: filters.status || "all", onValueChange: (value) => onFiltersChange({
                    ...filters,
                    status: value === "all" ? null : value,
                }), children: [_jsx(SelectTrigger, { className: "w-full sm:w-[180px]", children: _jsx(SelectValue, { placeholder: "Statut" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Tous" }), _jsx(SelectItem, { value: "unread", children: "Non lu" }), _jsx(SelectItem, { value: "read", children: "Lu" }), _jsx(SelectItem, { value: "pending", children: "En attente" }), _jsx(SelectItem, { value: "replied", children: "R\u00E9pondu" })] })] })] }));
};
