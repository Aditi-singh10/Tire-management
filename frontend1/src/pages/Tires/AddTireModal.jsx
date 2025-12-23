import { useState } from "react";
import { motion } from "framer-motion";
import { createTire } from "../../api/tireApi";

export default function AddTireModal({ onClose, onCreated }) {
  const [tireCode, setTireCode] = useState("");
  const [maxLifeKm, setMaxLifeKm] = useState("");

  const handleCreate = async () => {
    await createTire({
      tireCode,
      maxLifeKm: Number(maxLifeKm),
    });
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-96 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">
          🛞 Add New Tire
        </h3>

        <input
          placeholder="Tire Code (e.g. A01)"
          className="w-full border p-3 rounded-lg mb-3"
          value={tireCode}
          onChange={(e) => setTireCode(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Life (km)"
          className="w-full border p-3 rounded-lg mb-5"
          value={maxLifeKm}
          onChange={(e) => setMaxLifeKm(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-slate-600">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Create Tire
          </button>
        </div>
      </motion.div>
    </div>
  );
}
