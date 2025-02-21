import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const PilotSelection = ({ value, onChange, maxPilots }) => {
    return (_jsxs(Select, { value: value, onValueChange: onChange, children: [_jsx(SelectTrigger, { className: "min-w-[200px] bg-white", children: _jsx(SelectValue, { placeholder: "Nombre de pilotes" }) }), _jsx(SelectContent, { position: "popper", className: "bg-white", children: Array.from({ length: Math.min(maxPilots, 5) }, (_, i) => i + 1).map((num) => (_jsxs(SelectItem, { value: num.toString(), children: [num, " ", num === 1 ? "pilote" : "pilotes"] }, num))) })] }));
};
