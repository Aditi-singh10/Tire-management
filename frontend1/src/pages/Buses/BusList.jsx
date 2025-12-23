import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBuses } from "../../api/busApi";
import AddBusModal from "./AddBusModal";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const loadBuses = () => getBuses().then((res) => setBuses(res.data));

  useEffect(() => {
    loadBuses();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Buses</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow"
        >
          + Add Bus
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <motion.div
            key={bus._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
            onClick={() => navigate(`/buses/${bus._id}`)}
          >
            <h3 className="text-xl font-bold">{bus.busNumber}</h3>
            {/* <p className="text-slate-500 mt-1">
              Type: {bus.type || "N/A"}
            </p> */}
            <p className="text-slate-500 mt-1">
              Slots: <span className="font-medium">{bus.totalSlots}</span>
            </p>

            <div className="mt-4 text-sm text-blue-600 font-medium">
              View Details →
            </div>
          </motion.div>
        ))}
      </div>

      {showAdd && (
        <AddBusModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadBuses();
          }}
        />
      )}
    </motion.div>
  );
}
