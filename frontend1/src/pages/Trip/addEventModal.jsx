import { useState } from "react";
import { motion } from "framer-motion";
import { addTripEvent } from "../../api/tripApi";

export default function AddEventModal({ tripId, onClose }) {
  const [removedTireId, setRemovedTireId] = useState("");
  const [installedTireId, setInstalledTireId] = useState("");
  const [slotPosition, setSlotPosition] = useState("");
  const [distanceAtEvent, setDistanceAtEvent] = useState("");

  const handleAddEvent = async () => {
    await addTripEvent(tripId, {
      removedTireId,
      installedTireId,
      slotPosition,
      distanceAtEvent: Number(distanceAtEvent),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-96"
      >
        <h3 className="text-lg font-bold mb-4">
          Add Puncture Event
        </h3>

        <input
          placeholder="Removed Tire ID"
          className="w-full border p-2 rounded mb-2"
          value={removedTireId}
          onChange={(e) => setRemovedTireId(e.target.value)}
        />

        <input
          placeholder="Installed Tire ID"
          className="w-full border p-2 rounded mb-2"
          value={installedTireId}
          onChange={(e) => setInstalledTireId(e.target.value)}
        />

        <input
          placeholder="Slot Position"
          className="w-full border p-2 rounded mb-2"
          value={slotPosition}
          onChange={(e) => setSlotPosition(e.target.value)}
        />

        <input
          placeholder="Distance at Event (km)"
          type="number"
          className="w-full border p-2 rounded mb-4"
          value={distanceAtEvent}
          onChange={(e) => setDistanceAtEvent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAddEvent}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Add Event
          </button>
        </div>
      </motion.div>
    </div>
  );
}
