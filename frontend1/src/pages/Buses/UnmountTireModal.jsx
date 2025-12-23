import { useState } from "react";
import { motion } from "framer-motion";

export default function UnmountTireModal({
  slot,
  onClose,
  onDone,
}) {
  const [reason, setReason] = useState("");

  const handleUnmount = async () => {
    // call backend unmount service here
    console.log("Unmounting:", {
      slotId: slot._id,
      tireId: slot.tireId._id,
      reason,
    });
    onDone();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-bold mb-2">
          Unmount Tire
        </h3>

        <p className="mb-3 text-sm">
          Tire: <b>{slot.tireId.tireCode}</b>
        </p>

        <select
          className="w-full border p-3 mb-4"
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select Reason</option>
          <option value="puncture">Puncture</option>
          <option value="wear">Wear</option>
          <option value="replacement">Replacement</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleUnmount}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Unmount
          </button>
        </div>
      </motion.div>
    </div>
  );
}
