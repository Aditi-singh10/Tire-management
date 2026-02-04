import { useState } from "react";
import { motion } from "framer-motion";
import { createBus } from "../../api/busApi";
import { useLanguage } from "../../i18n/LanguageContext";

export default function AddBusModal({ onClose, onCreated }) {
  const [busNumber, setBusNumber] = useState("");
  const [totalSlots, setTotalSlots] = useState(6);
  const [emergencyTireCount, setEmergencyTireCount] = useState(0);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();
  const handleCreate = async () => {
    setError("");

    if (!busNumber || !totalSlots) {
      setError(t("errors.busRequired"));
      return;
    }

    if (emergencyTireCount < 0) {
      setError(t("errors.emergencyNegative"));
      return;
    }

    try {
      setLoading(true);
      await createBus({
        busNumber,
        totalSlots,
        emergencyTireCount,
        status,
      });

      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || t("errors.createBusFail"));
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
        <h3 className="text-xl font-bold mb-4">
          ➕ {t("buses.addBus").replace("+ ", "")}
        </h3>

        {/* Bus Number */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("buses.busNumber")}
          </label>
          <input
            className="w-full border p-3 rounded-lg"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
          />
        </div>

        {/* Total Slots */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("buses.totalSlots")}
          </label>
          <input
            type="number"
            min={1}
            className="w-full border p-3 rounded-lg"
            value={totalSlots}
            onChange={(e) => setTotalSlots(Number(e.target.value))}
          />
        </div>

        {/* Emergency Tire Count */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
           {t("buses.emergencyTires")}
          </label>
          <input
            type="number"
            min={0}
            className="w-full border p-3 rounded-lg"
            value={emergencyTireCount}
            onChange={(e) =>
              setEmergencyTireCount(Number(e.target.value))
            }
          />
          <p className="text-xs text-slate-500 mt-1">
            {t("buses.emergencyHint")}
          </p>
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("common.status")}
          </label>
          <select
            className="w-full border p-3 rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
             <option value="active">{t("common.active")}</option>
            <option value="maintenance">{t("common.maintenance")}</option>
            <option value="inactive">{t("common.inactive")}</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-slate-600">
             {t("common.cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            {loading ? t("common.creating") : t("common.create")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
