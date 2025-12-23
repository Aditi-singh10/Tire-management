import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { addTripEvent } from "../../api/tripApi";

export default function AddEventModal({ tripId, onClose }) {
  const [slots, setSlots] = useState([]);
  const [slotPosition, setSlotPosition] = useState("");
  const [distanceAtEvent, setDistanceAtEvent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSlots = async () => {
      // get trip → extract busId
      const tripRes = await api.get(`/trips/${tripId}`);
      const busId = tripRes.data.busId._id;

      //  get mounted slots for that bus
      const slotRes = await api.get(`/bus-tire-slots/${busId}`);

      setSlots(slotRes.data);
    };

    loadSlots();
  }, [tripId]);

  const handleAdd = async () => {
    if (!slotPosition || !distanceAtEvent) return;

    setLoading(true);

    await addTripEvent(tripId, {
      type: "puncture",
      slotPosition,
      distanceAtEvent: Number(distanceAtEvent),
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-96"
      >
        <h3 className="font-bold mb-4">Add Trip Event</h3>

        {/* Slot dropdown */}
        <select
          className="w-full border p-2 mb-3 rounded"
          value={slotPosition}
          onChange={(e) => setSlotPosition(e.target.value)}
        >
          <option value="">Select Slot</option>
          {slots.map((s) => (
            <option key={s._id} value={s.slotPosition}>
              {s.slotPosition} — {s.tireId.tireCode}
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
