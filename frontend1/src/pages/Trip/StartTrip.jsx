import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startTrip } from "../../api/tripApi";

export default function StartTrip() {
  const [busId, setBusId] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const navigate = useNavigate();

  const handleStart = async () => {
    const res = await startTrip({
      busId,
      totalDistance: Number(totalDistance),
    });
    navigate(`/trips/${res.data._id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Start Trip</h2>

      <div className="bg-white p-6 rounded-xl shadow w-96">
        <input
          placeholder="Bus ID"
          className="w-full border p-2 rounded mb-3"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
        />

        <input
          placeholder="Total Distance (km)"
          type="number"
          className="w-full border p-2 rounded mb-4"
          value={totalDistance}
          onChange={(e) => setTotalDistance(e.target.value)}
        />

        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Start Trip
        </button>
      </div>
    </motion.div>
  );
}
