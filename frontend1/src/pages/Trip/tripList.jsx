import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-bold">Trips</h2>
           <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">
            Status
            <select
              className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="aborted">Aborted</option>
            </select>
          </label>
          <button
            onClick={() => navigate("/trips/start")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Start Trip
          </button>
        </div>
      </div>

      {!filteredTrips.length && (
        <p className="text-slate-500">No trips yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip._id}
            onClick={() => navigate(`/trips/${trip._id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
          >
            <p className="font-semibold">Bus: {trip.busId?.busNumber || "—"}</p>

            <p className="text-sm text-slate-500">
              Distance:{" "}
              {trip.endStatus === "aborted"
                ? trip.actualDistance
                : trip.totalDistance}{" "}
              km
            </p>

            <p className="text-xs mt-2">
              {trip.endStatus === "aborted" ? (
                <span className="text-red-600 font-semibold">Aborted</span>
              ) : trip.endStatus === "completed" ? (
                <span className="text-green-600 font-semibold">Completed</span>
              ) : (
                <span className="text-orange-600 font-semibold">Ongoing</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

