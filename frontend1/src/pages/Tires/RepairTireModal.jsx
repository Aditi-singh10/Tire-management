import { useState } from "react";
import { motion } from "framer-motion";
import { repairTire } from "../../api/tireApi";
import { useLanguage } from "../../i18n/LanguageContext";

export default function RepairTireModal({
  tire,
  onClose,
  onRepaired,
}) {
  const [newCode, setNewCode] = useState("");
  const [maxLifeKm, setMaxLifeKm] = useState("");
   const requiresNewIdentity = tire?.status === "expired";
  const { t } = useLanguage();
  const trimmedCode = newCode.trim();
  const parsedMaxLifeKm = Number(maxLifeKm);
  
    const canSubmit = requiresNewIdentity
    ? trimmedCode.length > 0 &&
      Number.isFinite(parsedMaxLifeKm) &&
      parsedMaxLifeKm > 0
    : true;

  const handleRepair = async () => {
    if (!canSubmit) return;
    await repairTire(
      tire._id,
      requiresNewIdentity
        ? {
            newTireCode: trimmedCode,
            maxLifeKm: parsedMaxLifeKm,
          }
        : {}
    );
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
           {t("tires.repairTire")} {tire.tireCode}
        </h3>

       {requiresNewIdentity ? (
          <>
            <p className="text-sm text-slate-600 mb-3">
                {t("tires.repairExpiredHint")}
            </p>
            <input
               placeholder={t("tires.newTireCode")}
              className="w-full border p-2 rounded mb-3"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />

          <input
              placeholder={t("tires.maxLifeKm")}
              type="number"
              className="w-full border p-2 rounded mb-4"
              value={maxLifeKm}
              onChange={(e) => setMaxLifeKm(e.target.value)}
            />
          </>
        ) : (
          <p className="text-sm text-slate-600 mb-4">
           {t("tires.repairSameIdHint")}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-slate-600"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleRepair}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit}
          >
             {t("tires.repair")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
