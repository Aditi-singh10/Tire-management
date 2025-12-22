import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TripList() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trips</h2>

        <button
          onClick={() => navigate("/trips/start")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Start Trip
        </button>
      </div>

      <p className="text-slate-500">
        Active trips will appear here.
      </p>
    </motion.div>
  );
}
