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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTires()
      .then((res) =>
        setTires(res.data.filter((t) => t.status === "available"))
      )
      .catch(() =>
        setError("Failed to load available tires")
      );
  }, []);

  const handleMount = async () => {
    if (!slotPosition) {
      setError("Slot position missing");
      return;
    }

    if (!tireId) {
      setError("Please select a tire");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await mountTire({
        busId,
        tireId,
        slotPosition,
      });

      onMounted(); // parent will close modal
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to mount tire"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}   // ✅ click outside closes
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // ✅ isolate modal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-96 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-1">
          Mount Tire
        </h3>

        <p className="text-sm text-slate-500 mb-4">
          Slot:{" "}
          <span className="font-medium">
            {slotPosition}
          </span>
        </p>

        <select
          className="w-full border p-3 rounded-lg mb-3"
          value={tireId}
          onChange={(e) => setTireId(e.target.value)}
          disabled={loading}
        >
          <option value="">Select available tire</option>
          {tires.map((tire) => (
            <option key={tire._id} value={tire._id}>
              {tire.tireCode}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleMount}
            disabled={loading || !tireId}
            className={`px-5 py-2 rounded-lg text-white transition
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              }
            `}
          >
            {loading ? "Mounting..." : "Mount"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
