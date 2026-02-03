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
  const [isEmergency, setIsEmergency] = useState(false);

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

  /* ================= NORMAL SLOTS ================= */
  const normalSlots = Array.from({ length: bus.totalSlots }, (_, i) => {
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

  /* ================= EMERGENCY SLOTS ================= */
  const emergencyMounted = bus.emergencyTires || [];
  const emergencyEmpty =
    bus.emergencyTireCount - emergencyMounted.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold mb-2">
        🚍 Bus {bus.busNumber}
      </h2>

      <button
        onClick={() => navigate(`/history/bus-summary/${bus._id}`)}
        className="mb-6 bg-slate-800 text-white px-4 py-2 rounded-lg"
      >
        View Bus History
      </button>

      {/* ================= NORMAL TIRES ================= */}
      <h3 className="text-xl font-semibold mb-3">
        Normal Tire Slots
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {normalSlots.map((slot) => (
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
                    setIsEmergency(false);
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
                    setIsEmergency(false);
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

      {/* ================= EMERGENCY TIRES ================= */}
      <h3 className="text-xl font-semibold mb-3 text-amber-700">
        Emergency Tires
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mounted Emergency Tires */}
        {emergencyMounted.map((tire) => (
          <motion.div
            key={tire._id}
            className="bg-amber-50 p-4 rounded-xl border border-amber-300"
          >
            <p className="text-xs text-amber-700">
              Mounted Emergency Tire
            </p>
            <p className="font-semibold">{tire.tireCode}</p>

            <button
              onClick={() => {
                setActiveSlot(tire);
                setIsEmergency(true);
                setMode("unmount");
              }}
              className="mt-4 w-full bg-amber-600 text-white py-2 rounded-lg"
            >
              Drop Emergency Tire
            </button>
          </motion.div>
        ))}

        {/* Empty Emergency Slots */}
        {Array.from({ length: emergencyEmpty }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-amber-100 p-4 rounded-xl border border-dashed border-amber-400"
          >
            <p className="text-xs text-amber-700">
              Empty Emergency Slot
            </p>

            <button
              onClick={() => {
                setIsEmergency(true);
                setMode("mount");
                setActiveSlot(null);
              }}
              className="mt-6 w-full bg-amber-500 text-white py-2 rounded-lg"
            >
              Pick Emergency Tire
            </button>
          </motion.div>
        ))}
      </div>

      {/* ================= MODALS ================= */}
      {mode === "mount" && (
        <MountTireModal
          busId={bus._id}
          slotPosition={activeSlot}
          isEmergency={isEmergency}
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
          isEmergency={isEmergency}
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
