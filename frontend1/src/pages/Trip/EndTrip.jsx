import { useState } from "react";
import { motion } from "framer-motion";
import { endTrip } from "../../api/tripApi";

export default function EndTripModal({ tripId, onClose, onSuccess }) {
  const [endType, setEndType] = useState("");
  const [distance, setDistance] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnd = async () => {
    if (!endType) return;

    let payload;

    if (endType === "completed") {
      payload = { endType: "completed" };
    } else {
      if (!distance || Number(distance) <= 0) return;
      payload = {
        endType: "aborted", // ✅ FIXED
        actualDistance: Number(distance),
        reason,
      };
    }

    setLoading(true);
    try {
      await endTrip(tripId, payload);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-96"
      >
        <h3 className="font-bold mb-4">End Trip</h3>

        <select
          className="w-full border p-2 mb-3 rounded"
          value={endType}
          onChange={(e) => setEndType(e.target.value)}
        >
          <option value="">Select End Type</option>
          <option value="completed">Completed</option>
          <option value="aborted">Other (Interrupted)</option>
        </select>

        {endType === "aborted" && (
          <>
            <input
              type="number"
              placeholder="Distance travelled (km)"
              className="w-full border p-2 mb-3 rounded"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />

            <textarea
              placeholder="Reason for ending trip"
              className="w-full border p-2 mb-3 rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleEnd}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Ending..." : "End Trip"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
