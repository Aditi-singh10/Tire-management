import { useState } from "react";
import { motion } from "framer-motion";
import { createBus } from "../../api/busApi";

export default function AddBusModal({ onClose, onCreated }) {
  const [busNumber, setBusNumber] = useState("");
  const [type, setType] = useState("");

  const handleCreate = async () => {
    await createBus({ busNumber, type });
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
          🚍 Add New Bus
        </h3>

        <input
          placeholder="Bus Number"
          className="w-full border p-3 rounded-lg mb-3"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
        />

        <input
          placeholder="Bus Type (AC / Non-AC)"
          className="w-full border p-3 rounded-lg mb-5"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Create Bus
          </button>
        </div>
      </motion.div>
    </div>
  );
}
