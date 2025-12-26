import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function UnmountTireModal({
  slot,
  busId,         
  onClose,
  onDone,
}) {
  const [reason, setReason] = useState("");

  const handleUnmount = async () => {
    try {
      console.log("Unmounting:", {
        busId,
        slotPosition: slot.slotPosition,
        reason,
      });

      await axios.post(
        "http://localhost:5000/api/bus-tire-slots/unmount",
        {
          busId: busId,                    
          slotPosition: slot.slotPosition, 
          reason: reason,                  
        }
      );

      onDone(); // reload data
    } catch (err) {
      console.error("Unmount failed:", err);
    }
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
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select Reason</option>
          <option value="Puncture">Puncture</option>
          <option value="Wear">Wear</option>
          <option value="Replacement">Replacement</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleUnmount}
            disabled={!reason}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Unmount
          </button>
        </div>
      </motion.div>
    </div>
  );
}
