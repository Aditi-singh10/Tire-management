import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { useLanguage } from "../../i18n/LanguageContext";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
   const { t } = useLanguage();

  useEffect(() => {
    api.get("/trips").then((res) => setTrips(res.data));
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "ongoing") return !trip.endTime;
      return trip.endStatus === statusFilter;
    })
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || a.startTime || 0);
      const bDate = new Date(b.createdAt || b.startTime || 0);
      return bDate - aDate;
    });


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
     <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold">{t("trips.title")}</h2>
           <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">
             {t("common.status")}
            <select
              className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
             <option value="all">{t("common.all") || "All"}</option>
              <option value="ongoing">{t("trips.ongoing")}</option>
              <option value="completed">{t("trips.completed")}</option>
              <option value="aborted">{t("trips.aborted")}</option>
            </select>
          </label>
          <button
            onClick={() => navigate("/trips/start")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
             {t("trips.startTrip")}
          </button>
        </div>
      </div>

      {!filteredTrips.length && (
          <p className="text-slate-500">{t("trips.noTrips")}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip._id}
            onClick={() => navigate(`/trips/${trip._id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
          >
             <p className="font-semibold">
              {t("trips.bus")}: {trip.busId?.busNumber || "—"}
            </p>

            <p className="text-sm text-slate-500">
              {t("buses.distance")}:{" "}
              {trip.endStatus === "aborted"
                ? trip.actualDistance
                : trip.totalDistance}{" "}
              km
            </p>

            <p className="text-xs mt-2">
              {trip.endStatus === "aborted" ? (
                   <span className="text-red-600 font-semibold">
                  {t("trips.aborted")}
                </span>
              ) : trip.endStatus === "completed" ? (
                <span className="text-green-600 font-semibold">
                  {t("trips.completed")}
                </span>
              ) : (
                <span className="text-orange-600 font-semibold">
                  {t("trips.ongoing")}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

