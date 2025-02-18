import { motion } from "framer-motion";

export const ReservationHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h1 className="text-4xl font-bold mb-6">Réservez Votre Session de Pilotage</h1>
      
    </motion.div>
  );
};
