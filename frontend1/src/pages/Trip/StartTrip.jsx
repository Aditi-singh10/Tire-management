import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { startTrip } from "../../api/tripApi";
import { useLanguage } from "../../i18n/LanguageContext";

export default function StartTrip() {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [oneWayDistance, setOneWayDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const { t } = useLanguage();
  useEffect(() => {
    api.get("/buses").then((res) => setBuses(res.data));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    const parsedDistance = Number(oneWayDistance);
    const res = await startTrip({
      busId,
      totalDistance: parsedDistance * 2,
    });
    navigate(`/trips/${res.data._id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">{t("trips.startTrip")}</h2>

      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <select
          className="w-full border p-2 mb-3"
          onChange={(e) => setBusId(e.target.value)}
        >
          <option value="">{t("trips.selectBus")}</option>
          {buses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.busNumber}
            </option>
          ))}
        </select>

        <input
          type="number"
         placeholder={t("trips.oneWayDistance")}
          className="w-full border p-2 mb-4"
          value={oneWayDistance}
          onChange={(e) => setOneWayDistance(e.target.value)}
        />
        {oneWayDistance && (
          <p className="text-xs text-slate-500 mb-3">
            {t("trips.totalDistance")}{" "}
            {t("trips.willBe", { value: Number(oneWayDistance) * 2 })} km.
          </p>
        )}
        <button
          disabled={loading || !busId || !oneWayDistance}
          onClick={handleStart}
          className="bg-blue-600 text-white w-full py-2 rounded-lg"
        >
         {t("trips.startTrip")}
        </button>
      </div>
    </motion.div>
  );
}
