import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export const ReservationHeader = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center mb-16", children: _jsx("h1", { className: "text-4xl font-bold mb-6", children: "R\u00E9servez Votre Session de Pilotage" }) }));
};
