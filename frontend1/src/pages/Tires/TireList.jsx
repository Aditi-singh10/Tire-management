import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTires } from "../../api/tireApi";
import TireCard from "./TireCard";
import RepairTireModal from "./RepairTireModal";

export default function TireList() {
  const [tires, setTires] = useState([]);
  const [selectedTire, setSelectedTire] = useState(null);

  const loadTires = () =>
    getTires().then((res) => setTires(res.data));

  useEffect(() => {
    loadTires();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Tires</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tires.map((tire) => (
          <TireCard
            key={tire._id}
            tire={tire}
            onRepair={() => setSelectedTire(tire)}
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
    </motion.div>
  );
}
