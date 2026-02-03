import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { mountTire } from "../../api/busApi";
import { mountEmergencyTire, mountTire } from "../../api/busApi";
import { getTires } from "../../api/tireApi";

export default function MountTireModal({
  busId,
  slotPosition,
  busNumber,
  isEmergency = false,
  onClose,
  onDone,
}) {
  const [tires, setTires] = useState([]);
  const [tireId, setTireId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTires().then((res) =>
      setTires(
         res.data.filter(
          (t) => t.status === "available" || t.status === "repaired"
        )
      )
    );
  }, []);

  const handleMount = async () => {
    if (!tireId) return;
    setLoading(true);
    // await mountTire({ busId, tireId, slotPosition });
      if (isEmergency) {
      await mountEmergencyTire({ busId, tireId });
    } else {
      await mountTire({ busId, tireId, slotPosition });
    }
    onDone();
  };

  const selectedTire = tires.find((t) => t._id === tireId);


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-96"
      >
        <h3 className="text-lg font-bold mb-2">
          {isEmergency ? "Pick Emergency Tire" : "Mount Tire"}
        </h3>

        {!isEmergency && (
          <p className="text-sm mb-4">
            Slot: <b>{slotPosition}</b>
          </p>
        )}

        <select
          className="w-full border p-3 rounded-lg mb-4"
          onChange={(e) => setTireId(e.target.value)}
        >
          <option value="">Select Tire</option>
          {tires.map((t) => (
            <option key={t._id} value={t._id}>
              {t.tireCode}
            </option>
          ))}
        </select>

        {isEmergency && selectedTire && busNumber && (
          <p className="text-sm text-slate-600 mb-4">
            Tire <b>{selectedTire.tireCode}</b> is being carried
            as an emergency tire on Bus <b>{busNumber}</b> for
            immediate replacement in case of a puncture or other
            issues during the trip.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleMount}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
             {isEmergency ? "Carry" : "Mount"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
