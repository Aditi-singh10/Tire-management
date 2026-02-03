import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addTripEvent, endTrip, getTripById } from "../../api/tripApi";
import { getBusById, getBusTireSlots } from "../../api/busApi";

export default function EndTripModal({ tripId, onClose, onSuccess }) {
  const [endType, setEndType] = useState("");
  const [distance, setDistance] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [emergencyTires, setEmergencyTires] = useState([]);
  const [emergencyOccurred, setEmergencyOccurred] = useState("no");
  const [replacements, setReplacements] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const tripRes = await getTripById(tripId);
      const busId = tripRes.data.busId?._id;
      if (!busId) {
        return;
      }

      const [slotRes, busRes] = await Promise.all([
        getBusTireSlots(busId),
        getBusById(busId),
      ]);
      setSlots(slotRes.data || []);
      setEmergencyTires(busRes.data.emergencyTires || []);
    };

    loadData();
  }, [tripId]);

  const usedEmergencyIds = useMemo(
    () =>
      replacements
        .map((replacement) => replacement.installedTireId)
        .filter(Boolean),
    [replacements]
  );

  const updateReplacement = (index, key, value) => {
    setReplacements((prev) =>
      prev.map((replacement, replacementIndex) =>
        replacementIndex === index
          ? { ...replacement, [key]: value }
          : replacement
      )
    );
  };

  const addReplacement = () => {
    setReplacements((prev) => [
      ...prev,
      {
        slotPosition: "",
        eventType: "",
        installedTireId: "",
        distanceAtEvent: "",
      },
    ]);
  };

  const removeReplacement = (index) => {
    setReplacements((prev) =>
      prev.filter((_, replacementIndex) => replacementIndex !== index)
    );
  };

  const handleEnd = async () => {
    if (!endType) return;

    if (emergencyOccurred === "yes" && replacements.length === 0) {
      return;
    }

    const invalidReplacement = replacements.some((replacement) => {
      const distanceValue = Number(replacement.distanceAtEvent);
      return (
        !replacement.slotPosition ||
        !replacement.eventType ||
        !replacement.installedTireId ||
        !replacement.distanceAtEvent ||
        Number.isNaN(distanceValue) ||
        distanceValue <= 0
      );
    });

    if (emergencyOccurred === "yes" && invalidReplacement) return;

    let payload;

    if (endType === "completed") {
      payload = {
        endStatus: "completed", //  CORRECT FIELD
      };
    } else {
      if (!distance || Number(distance) <= 0) return;

      payload = {
        endStatus: "aborted", //  CORRECT FIELD
        actualDistance: Number(distance),
        endReason: reason || null,
      };
    }

    setLoading(true);
    try {
        if (emergencyOccurred === "yes") {
        for (const replacement of replacements) {
          const slot = slots.find(
            (slotItem) => slotItem.slotPosition === replacement.slotPosition
          );
          if (!slot?.tireId?._id) {
            return;
          }
          await addTripEvent(tripId, {
            type: replacement.eventType,
            slotPosition: replacement.slotPosition,
            removedTireId: slot.tireId._id,
            installedTireId: replacement.installedTireId,
            distanceAtEvent: Number(replacement.distanceAtEvent),
          });
        }
      }
      await endTrip(tripId, payload);
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-[32rem] max-h-[85vh] overflow-y-auto"
      >
        <h3 className="font-bold mb-4">End Trip</h3>

        {endType === "aborted" && (
          <>
            <input
              type="number"
              placeholder="Distance travelled (km)"
              className="w-full border p-2 mb-3 rounded"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />

            <textarea
              placeholder="Reason for ending trip"
              className="w-full border p-2 mb-3 rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </>
        )}

        <div className="border-t pt-4 mt-2">
          <p className="font-semibold text-sm mb-2">
            Emergency replacement during trip?
          </p>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="emergencyOccurred"
                value="no"
                checked={emergencyOccurred === "no"}
                onChange={(e) => {
                  setEmergencyOccurred(e.target.value);
                  setReplacements([]);
                }}
              />
              No
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="emergencyOccurred"
                value="yes"
                checked={emergencyOccurred === "yes"}
                onChange={(e) => setEmergencyOccurred(e.target.value)}
              />
              Yes
            </label>
          </div>

          {emergencyOccurred === "yes" && (
            <>
              <p className="text-xs text-slate-500 mb-3">
                Select the slot where a tire was defected, choose the emergency
                tire used, and log the km at which it happened.
              </p>

              {replacements.map((replacement, index) => {
                const slot = slots.find(
                  (slotItem) =>
                    slotItem.slotPosition === replacement.slotPosition
                );
                return (
                  <div
                    key={`replacement-${index}`}
                    className="border rounded-lg p-3 mb-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">
                        Emergency replacement {index + 1}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => removeReplacement(index)}
                      >
                        Remove
                      </button>
                    </div>

                    <select
                      className="w-full border p-2 mb-2 rounded"
                      value={replacement.slotPosition}
                      onChange={(e) =>
                        updateReplacement(index, "slotPosition", e.target.value)
                      }
                    >
                      <option value="">Select Slot</option>
                      {slots.map((slotItem) => (
                        <option
                          key={slotItem._id}
                          value={slotItem.slotPosition}
                        >
                          {slotItem.slotPosition}
                        </option>
                      ))}
                    </select>

                    {slot?.tireId && (
                      <p className="text-xs text-red-600 mb-2">
                        Defected tire: <b>{slot.tireId.tireCode}</b>
                      </p>
                    )}

                    <select
                      className="w-full border p-2 mb-2 rounded"
                      value={replacement.eventType}
                      onChange={(e) =>
                        updateReplacement(index, "eventType", e.target.value)
                      }
                    >
                      <option value="">Select Defect Reason</option>
                      <option value="puncture">Puncture</option>
                      <option value="expired">Damage</option>
                    </select>

                    <select
                      className="w-full border p-2 mb-2 rounded"
                      value={replacement.installedTireId}
                      onChange={(e) =>
                        updateReplacement(
                          index,
                          "installedTireId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Emergency Tire</option>
                      {emergencyTires.map((tire) => (
                        <option
                          key={tire._id}
                          value={tire._id}
                          disabled={
                            usedEmergencyIds.includes(tire._id) &&
                            replacement.installedTireId !== tire._id
                          }
                        >
                          {tire.tireCode}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Defect at distance (km)"
                      className="w-full border p-2 rounded"
                      value={replacement.distanceAtEvent}
                      onChange={(e) =>
                        updateReplacement(
                          index,
                          "distanceAtEvent",
                          e.target.value
                        )
                      }
                    />
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addReplacement}
                className="text-sm text-orange-600"
              >
                + Add emergency replacement
              </button>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleEnd}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Ending..." : "End Trip"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
