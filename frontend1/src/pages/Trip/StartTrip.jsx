import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { startTrip } from "../../api/tripApi";

export default function StartTrip() {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [totalDistance, setTotalDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/buses").then((res) => setBuses(res.data));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    const res = await startTrip({
      busId,
      totalDistance: Number(totalDistance),
    });
    navigate(`/trips/${res.data._id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Start Trip</h2>

      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <select
          className="w-full border p-2 mb-3"
          onChange={(e) => setBusId(e.target.value)}
        >
          <option value="">Select Bus</option>
          {buses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.busNumber}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Total Distance (km)"
          className="w-full border p-2 mb-4"
          value={totalDistance}
          onChange={(e) => setTotalDistance(e.target.value)}
        />

        <button
          disabled={loading || !busId || !totalDistance}
          onClick={handleStart}
          className="bg-blue-600 text-white w-full py-2 rounded-lg"
        >
          Start Trip
        </button>
      </div>
    </motion.div>
  );
}
