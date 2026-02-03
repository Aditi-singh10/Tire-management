import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTires } from "../../api/tireApi";
import TireCard from "./TireCard";
import AddTireModal from "./AddTireModal";
import RepairTireModal from "./RepairTireModal";

export default function TireList() {
  const [tires, setTires] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [repairingTire, setRepairingTire] = useState(null);

  const loadTires = async () => {
    const res = await getTires();
    setTires(res.data);
  };

  useEffect(() => {
    loadTires();
  }, []);

  const filteredTires = tires.filter((tire) => {
    if (statusFilter === "all") return true;
    return tire.status === statusFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-3xl font-bold">Tires</h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">
            Status
            <select
              className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="mounted">Mounted</option>
              <option value="punctured">Punctured</option>
              <option value="expired">Expired</option>
              <option value="repaired">Repaired</option>
            </select>
          </label>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
          >
            + Add Tire
          </button>
        </div>
      </div>

      {!filteredTires.length && (
        <p className="text-slate-500">No tires found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTires.map((tire) => (
          <TireCard
            key={tire._id}
            tire={tire}
            onRepair={(selected) => setRepairingTire(selected)}
          />
        ))}
      </div>

      {/* MODAL */}
      {showAdd && (
        <AddTireModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            loadTires();
          }}
        />
      )}
      {repairingTire && (
        <RepairTireModal
          tire={repairingTire}
          onClose={() => setRepairingTire(null)}
          onRepaired={() => {
            setRepairingTire(null);
            loadTires();
          }}
        />
      )}
    </motion.div>
  );
}
