import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTires } from "../../api/tireApi";
import TireCard from "./TireCard";
import AddTireModal from "./AddTireModal";
import RepairTireModal from "./RepairTireModal";
import { useLanguage } from "../../i18n/LanguageContext";

export default function TireList() {
  const [tires, setTires] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [repairingTire, setRepairingTire] = useState(null);
  const { t } = useLanguage();

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
          <h2 className="text-3xl font-bold">{t("tires.title")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">
             {t("common.status")}
            <select
              className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
             <option value="all">{t("common.all")}</option>
              <option value="available">{t("tires.status.available")}</option>
              <option value="mounted">{t("tires.status.mounted")}</option>
              <option value="punctured">{t("tires.status.punctured")}</option>
              <option value="expired">{t("tires.status.expired")}</option>
              <option value="repaired">{t("tires.status.repaired")}</option>
            </select>
          </label>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
          >
             {t("tires.addTire")}
          </button>
        </div>
      </div>

      {!filteredTires.length && (
         <p className="text-slate-500">{t("tires.noTires")}</p>
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
