import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusById, getBusTireSlots } from "../../api/busApi";
import MountTireModal from "./MountTire";

export default function BusDetails() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    getBusById(id).then((res) => setBus(res.data));
    getBusTireSlots(id).then((res) => setSlots(res.data));
  }, [id]);

  if (!bus) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bus {bus.busNumber}</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Mount Tire
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot._id} className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-slate-500">Slot Position</p>
            <p className="font-semibold">{slot.slotPosition}</p>
            <p className="mt-2 text-slate-600">Tire: {slot.tireId?.tireCode}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <MountTireModal
          busId={id}
          slotPosition={activeSlot}
          onClose={() => setActiveSlot(null)}
          onMounted={() => {
            setActiveSlot(null);
            loadSlots();
          }}
        />
      )}
    </motion.div>
  );
}
