import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { addTripEvent } from "../../api/tripApi";

export default function AddEventModal({ tripId, onClose }) {
  const [slots, setSlots] = useState([]);
  const [availableTires, setAvailableTires] = useState([]);

  const [slotPosition, setSlotPosition] = useState("");
  const [removedTire, setRemovedTire] = useState(null);
  const [eventType, setEventType] = useState("");
  const [installedTireId, setInstalledTireId] = useState("");
  const [distanceAtEvent, setDistanceAtEvent] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    const loadData = async () => {
      const tripRes = await api.get(`/trips/${tripId}`);
      const busId = tripRes.data.busId._id;

      const slotRes = await api.get(`/bus-tire-slots/${busId}`);
      setSlots(slotRes.data);

      const tireRes = await api.get("/tires");
      setAvailableTires(
        tireRes.data.filter((t) => t.status === "available")
      );
    };

    loadData();
  }, [tripId]);

  /* SLOT CHANGE → AUTO SET REMOVED TIRE */
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
      !distanceAtEvent
    ) {
      return;
    }

    const payload = {
      type: eventType,
      slotPosition,
      removedTireId: removedTire._id,
      installedTireId,
      distanceAtEvent: Number(distanceAtEvent),
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
        <h3 className="font-bold mb-4">Add Trip Event</h3>

        {/* Slot */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={slotPosition}
          onChange={(e) => setSlotPosition(e.target.value)}
        >
          <option value="">Select Slot</option>
          {slots.map((s) => (
            <option key={s._id} value={s.slotPosition}>
              {s.slotPosition}
            </option>
          ))}
        </select>

        {/* Removed Tire */}
        {removedTire && (
          <div className="text-sm mb-3 text-red-600">
            Removed Tire: <b>{removedTire.tireCode}</b>
          </div>
        )}

        {/* Reason */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="">Select Reason</option>
          <option value="puncture">Puncture</option>
         <option value="expired">Damage</option>

        </select>

        {/* Replacement Tire (ALWAYS REQUIRED) */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={installedTireId}
          onChange={(e) => setInstalledTireId(e.target.value)}
        >
          <option value="">Select Replacement Tire</option>
          {availableTires.map((t) => (
            <option key={t._id} value={t._id}>
              {t.tireCode}
            </option>
          ))}
        </select>

        {/* Distance */}
        <input
          type="number"
          placeholder="Distance at event (km)"
          className="w-full border p-2 mb-4 rounded"
          value={distanceAtEvent}
          onChange={(e) => setDistanceAtEvent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
