import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTires } from "../../api/tireApi";
import TireCard from "./TireCard";
import RepairTireModal from "./RepairTireModal";
import AddTireModal from "./AddTireModal";

export default function TireList() {
  const [tires, setTires] = useState([]);
  const [selectedTire, setSelectedTire] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const loadTires = () =>
    getTires().then((res) => setTires(res.data));

  useEffect(() => {
    loadTires();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tires</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-xl shadow"
        >
          + Add Tire
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tires.map((tire) => (
          <TireCard
            key={tire._id}
            tire={tire}
            onRepair={() => setSelectedTire(tire)}
            onMount={() =>
              alert("Mount flow via Bus Details")
            }
          />
        ))}
      </div>

      {selectedTire && (
        <RepairTireModal
          tire={selectedTire}
          onClose={() => setSelectedTire(null)}
          onRepaired={() => {
            setSelectedTire(null);
            loadTires();
          }}
        />
      )}

      {showAdd && (
        <AddTireModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadTires();
          }}
        />
      )}
    </motion.div>
  );
}
