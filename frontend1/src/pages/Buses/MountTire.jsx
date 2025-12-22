import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { mountTire } from "../../api/busApi";
import { getTires } from "../../api/tireApi";

export default function MountTireModal({
  busId,
  slotPosition,
  onClose,
  onMounted,
}) {
  const [tires, setTires] = useState([]);
  const [tireId, setTireId] = useState("");

  useEffect(() => {
    getTires().then((res) => setTires(res.data));
  }, []);

  const handleMount = async () => {
    await mountTire({ busId, tireId, slotPosition });
    onMounted();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-96"
      >
        <h3 className="text-xl font-bold mb-4">
          Mount Tire ({slotPosition})
        </h3>

        <select
          className="w-full border p-3 rounded-lg mb-4"
          value={tireId}
          onChange={(e) => setTireId(e.target.value)}
        >
          <option value="">Select Tire</option>
          {tires.map((tire) => (
            <option key={tire._id} value={tire._id}>
              {tire.tireCode}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleMount}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Mount
          </button>
        </div>
      </motion.div>
    </div>
  );
}
