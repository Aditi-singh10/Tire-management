import { useState } from "react";
import { motion } from "framer-motion";
import { createTire } from "../../api/tireApi";

export default function AddTireModal({ onClose, onCreated }) {
  const [tireCode, setTireCode] = useState("");
  const [maxLifeKm, setMaxLifeKm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!tireCode || !maxLifeKm) return;

    setLoading(true);
    try {
      await createTire({
        tireCode,
        maxLifeKm: Number(maxLifeKm),
      });
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-96 shadow"
      >
        <h3 className="text-xl font-bold mb-4">
          ➕ Add New Tire
        </h3>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Tire Code (e.g. TYR-001)"
          value={tireCode}
          onChange={(e) => setTireCode(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 rounded mb-4"
          placeholder="Max Life (km)"
          value={maxLifeKm}
          onChange={(e) => setMaxLifeKm(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
