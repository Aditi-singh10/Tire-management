import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusById, getBusTireSlots } from "../../api/busApi";
import MountTireModal from "./MountTire";
import UnmountTireModal from "./UnmountTireModal";

export default function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [bus, setBus] = useState(null);
  const [dbSlots, setDbSlots] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [mode, setMode] = useState(null); // mount | unmount

  const loadData = async () => {
    const [busRes, slotRes] = await Promise.all([
      getBusById(id),
      getBusTireSlots(id),
    ]);

    setBus(busRes.data);
    setDbSlots(slotRes.data);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!bus) return null;

  //  CREATE VIRTUAL SLOTS
  const allSlots = Array.from({ length: bus.totalSlots }, (_, i) => {
    const slotPosition = `slot-${i + 1}`;
    const mountedSlot = dbSlots.find(
      (s) => s.slotPosition === slotPosition
    );

    return {
      slotPosition,
      mounted: !!mountedSlot,
      data: mountedSlot || null,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-2">
        🚍 Bus {bus.busNumber}
      </h2>

      {/* HISTORY BUTTON */}
      <button
        onClick={() => navigate(`/history/bus-summary/${bus._id}`)}
        className="mb-6 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
      >
        View Tire History
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allSlots.map((slot) => (
          <motion.div
            key={slot.slotPosition}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-4 rounded-xl shadow border"
          >
            <p className="text-xs text-slate-500">Slot</p>
            <p className="font-semibold">{slot.slotPosition}</p>

            <p className="mt-2 text-sm">
              Tire:{" "}
              {slot.mounted ? (
                <span className="font-medium">
                  {slot.data.tireId.tireCode}
                </span>
              ) : (
                <span className="text-green-600">Empty</span>
              )}
            </p>

            <div className="mt-4">
              {slot.mounted ? (
                <button
                  onClick={() => {
                    setActiveSlot(slot.data);
                    setMode("unmount");
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg"
                >
                  Unmount Tire
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveSlot(slot.slotPosition);
                    setMode("mount");
                  }}
                  className="w-full bg-green-600 text-white py-2 rounded-lg"
                >
                  Mount Tire
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODALS */}
      {mode === "mount" && activeSlot && (
        <MountTireModal
          busId={bus._id}
          slotPosition={activeSlot}
          onClose={() => {
            setMode(null);
            setActiveSlot(null);
          }}
          onDone={() => {
            setMode(null);
            setActiveSlot(null);
            loadData();
          }}
        />
      )}

      {mode === "unmount" && activeSlot && (
        <UnmountTireModal
          slot={activeSlot}
          busId={bus._id}
          onClose={() => {
            setMode(null);
            setActiveSlot(null);
          }}
          onDone={() => {
            setMode(null);
            setActiveSlot(null);
            loadData();
          }}
        />
      )}
    </motion.div>
  );
}
