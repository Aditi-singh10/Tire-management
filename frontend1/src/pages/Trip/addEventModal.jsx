import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { addTripEvent } from "../../api/tripApi";
import { useLanguage } from "../../i18n/LanguageContext";

export default function AddEventModal({ tripId, onClose }) {
  const [slots, setSlots] = useState([]);
  const [availableTires, setAvailableTires] = useState([]);
  const { t } = useLanguage()
  const [slotPosition, setSlotPosition] = useState("");
  const [removedTire, setRemovedTire] = useState(null);
  const [eventType, setEventType] = useState("");
  const [installedTireId, setInstalledTireId] = useState("");
  const [dispatchType, setDispatchType] = useState("outbound");
  const [legDistance, setLegDistance] = useState("");
  const [oneWayDistance, setOneWayDistance] = useState(0);
  const [loading, setLoading] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    const loadData = async () => {
      const tripRes = await api.get(`/trips/${tripId}`);
      const busId = tripRes.data.busId._id;
       const totalDistance = Number(tripRes.data.totalDistance || 0);
      setOneWayDistance(totalDistance > 0 ? totalDistance / 2 : 0);
      const slotRes = await api.get(`/bus-tire-slots/${busId}`);
      setSlots(slotRes.data);

      const tireRes = await api.get("/tires");
      setAvailableTires(
         tireRes.data.filter(
          (t) => t.status === "available" || t.status === "repaired"
        )
      );
    };

    loadData();
  }, [tripId]);

  /* SLOT CHANGE: AUTO SET REMOVED TIRE */
  useEffect(() => {
    const slot = slots.find((s) => s.slotPosition === slotPosition);
    setRemovedTire(slot?.tireId || null);
  }, [slotPosition, slots]);

  /* SUBMIT */
  const handleAdd = async () => {
    if (
      !slotPosition ||
      !eventType ||
      !removedTire ||
      !installedTireId ||
      !legDistance
    ) {
      return;
    }

    const payload = {
      type: eventType,
      slotPosition,
      removedTireId: removedTire._id,
      installedTireId,
      dispatchType,
      legDistance: Number(legDistance),
      distanceAtEvent: Number(legDistance),
    };

    setLoading(true);
    try {
      await addTripEvent(tripId, payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-96"
      >
        <h3 className="font-bold mb-4">{t("trips.addTripEvent")}</h3>

        {/* Slot */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={slotPosition}
          onChange={(e) => setSlotPosition(e.target.value)}
        >
              <option value="">{t("trips.selectSlot")}</option>
          {slots.map((s) => (
            <option key={s._id} value={s.slotPosition}>
              {s.slotPosition}
            </option>
          ))}
        </select>

        {/* Removed Tire */}
        {removedTire && (
          <div className="text-sm mb-3 text-red-600">
             {t("trips.removedTire")}: <b>{removedTire.tireCode}</b>
          </div>
        )}

        {/* Reason */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
            <option value="">{t("trips.selectReason")}</option>
          <option value="puncture">{t("trips.puncture")}</option>
         <option value="expired">{t("trips.damage")}</option>

        </select>

        {/* Replacement Tire (ALWAYS REQUIRED) */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={installedTireId}
          onChange={(e) => setInstalledTireId(e.target.value)}
        >
           <option value="">{t("trips.selectReplacementTire")}</option>
          {availableTires.map((t) => (
            <option key={t._id} value={t._id}>
              {t.tireCode}
            </option>
          ))}
        </select>

            {/* Dispatch */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={dispatchType}
          onChange={(e) => setDispatchType(e.target.value)}
        >
         <option value="outbound">{t("trips.dispatchOutbound")}</option>
          <option value="return">{t("trips.dispatchReturn")}</option>
        </select>

        {oneWayDistance > 0 && (
          <p className="text-xs text-slate-500 mb-2">
            {t("trips.oneWayDistance")}: {oneWayDistance} km
          </p>
        )}

        {/* Distance */}
        <input
          type="number"
           placeholder={t("trips.distanceInLeg")}
          className="w-full border p-2 mb-4 rounded"
          value={legDistance}
          onChange={(e) => setLegDistance(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>{t("common.cancel")}</button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? t("trips.adding") : t("trips.addEvent")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
