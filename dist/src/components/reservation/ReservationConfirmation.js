import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export const ReservationConfirmation = ({ id }) => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "w-[400px] bg-white rounded-lg shadow-lg p-6 border border-gray-200", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\u2705 R\u00E9servation confirm\u00E9e" }), _jsx("p", { className: "text-gray-600", children: "Votre r\u00E9servation a bien \u00E9t\u00E9 enregistr\u00E9e." })] }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600", children: [_jsx("p", { children: "\u2022 R\u00E8glement : Le paiement se fera sur place" }), _jsx("p", { children: "\u2022 Gestion : Vous pouvez consulter et annuler vos r\u00E9servations depuis votre compte" }), _jsx("p", { children: "\u2022 Annulation : Si vous devez annuler, utilisez la page \"Mon compte\"" })] }), _jsx(Button, { variant: "outline", className: "w-full mt-4", onClick: () => navigate("/account"), children: "G\u00E9rer mes r\u00E9servations" })] }) }));
};
