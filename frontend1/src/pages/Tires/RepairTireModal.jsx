import { useState } from "react";
import { motion } from "framer-motion";
import { repairTire } from "../../api/tireApi";

export default function RepairTireModal({
  tire,
  onClose,
  onRepaired,
}) {
  const [newCode, setNewCode] = useState("");
  const [maxLifeKm, setMaxLifeKm] = useState("");
  const trimmedCode = newCode.trim();
  const parsedMaxLifeKm = Number(maxLifeKm);
  const canSubmit =
    trimmedCode.length > 0 &&
    Number.isFinite(parsedMaxLifeKm) &&
    parsedMaxLifeKm > 0;

  const handleRepair = async () => {
     if (!canSubmit) return;
    await repairTire(tire._id, {
      newTireCode: trimmedCode,
      maxLifeKm: parsedMaxLifeKm,
    });
    onRepaired();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-96"
      >
        <h3 className="text-lg font-bold mb-4">
          Repair Tire {tire.tireCode}
        </h3>

        <input
          placeholder="New Tire Code (e.g. A01-R1)"
          className="w-full border p-2 rounded mb-3"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
        />

        <input
          placeholder="Max Life Km"
          type="number"
          className="w-full border p-2 rounded mb-4"
          value={maxLifeKm}
          onChange={(e) => setMaxLifeKm(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleRepair}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit}
          >
            Repair
          </button>
        </div>
      </motion.div>
    </div>
  );
}
