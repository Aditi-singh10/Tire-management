import { useState } from "react";
import { motion } from "framer-motion";
// import axios from "axios";
import { unmountEmergencyTire, unmountTire } from "../../api/busApi";
import { useLanguage } from "../../i18n/LanguageContext";

export default function UnmountTireModal({
  slot,
  busId,
  isEmergency = false,         
  onClose,
  onDone,
}) {
  const [reason, setReason] = useState("");
  const { t } = useLanguage();
  const handleUnmount = async () => {
    try {
       if (isEmergency) {
        await unmountEmergencyTire({
          busId,
          tireId: slot._id,
          reason,
        });
      } else {
        await unmountTire({
          busId,
          slotPosition: slot.slotPosition,
          reason,
        });
      }
      onDone(); // reload data
    } catch (err) {
      console.error("Unmount failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-bold mb-2">
            {isEmergency ? t("buses.dropEmergencyTire") : t("buses.unmountTire")}
        </h3>

        <p className="mb-3 text-sm">
          {t("history.tire")}:{" "}
          <b>{isEmergency ? slot.tireCode : slot.tireId.tireCode}</b>
        </p>

        <select
          className="w-full border p-3 mb-4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">{t("buses.selectReason")}</option>
          <option value="Puncture">{t("buses.unmountReason.puncture")}</option>
          <option value="Wear">{t("buses.unmountReason.wear")}</option>
          <option value="Replacement">
            {t("buses.unmountReason.replacement")}
          </option>
          <option value="Maintenance">
            {t("buses.unmountReason.maintenance")}
          </option>
        </select>

        <div className="flex justify-end gap-2">
         <button onClick={onClose}>{t("common.cancel")}</button>
          <button
            onClick={handleUnmount}
            disabled={!reason}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            {t("buses.unmountTire")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
