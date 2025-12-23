import { useState } from "react";
import { motion } from "framer-motion";
import { createBus } from "../../api/busApi";

export default function AddBusModal({ onClose, onCreated }) {
  const [busNumber, setBusNumber] = useState("");
  const [totalSlots, setTotalSlots] = useState(6);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!busNumber || !totalSlots) {
      setError("Bus number and total slots are required");
      return;
    }

    try {
      setLoading(true);
      await createBus({ busNumber, totalSlots, status });
      onCreated();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-96 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">➕ Add Bus</h3>

        <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Bus Number
      </label>
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Enter bus number"
        value={busNumber}
        onChange={(e) => setBusNumber(e.target.value)}
      />
    </div>


        {/* Total Slots */}
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Total Slots
      </label>
      <input
        type="number"
        min={1}
        className="w-full border p-3 rounded-lg"
        placeholder="Enter total slots"
        value={totalSlots}
        onChange={(e) => setTotalSlots(e.target.value)}
      />
    </div>

       {/* Status */}
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Status
      </label>
      <select
        className="w-full border p-3 rounded-lg"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="active">Active</option>
        <option value="maintenance">Maintenance</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-slate-600">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
