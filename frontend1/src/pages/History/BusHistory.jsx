import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusTripSummary } from "../../api/historyApi";
import clsx from "clsx";

export default function BusHistory() {
  const { busId } = useParams();
  const [data, setData] = useState(null);
  const [openTrip, setOpenTrip] = useState(null);

  useEffect(() => {
    getBusTripSummary(busId).then(res => setData(res.data));
  }, [busId]);

  if (!data) return null;

  const { currentTrip, previousTrips } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">
        🚍 Bus History
      </h2>

      {/* CURRENT TRIP */}
      {currentTrip && (
        <div className="mb-6 border-l-4 border-green-500 bg-green-50 p-4 rounded-xl">
          <p className="font-semibold text-green-700 mb-2">
            Ongoing Trip
          </p>

          <p>Started: {new Date(currentTrip.startTime).toLocaleString()}</p>
          <p>Distance: {currentTrip.distanceTravelled} km</p>

          <div className="grid grid-cols-2 gap-2 mt-3">
             {currentTrip.slots.map(t => (
              <div
                key={t.slotPosition}
                className="bg-white p-2 rounded shadow text-sm"
              >
                <b>{t.slotPosition}</b> → {t.tireCode}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREVIOUS TRIPS */}
      <h3 className="font-semibold mb-3">Previous Trips</h3>

      <div className="space-y-3">
        {previousTrips.map(trip => (
          <div
            key={trip.tripId}
            className={clsx(
              "rounded-xl border",
              trip.status === "aborted"
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            )}
          >
            <button
              onClick={() =>
                setOpenTrip(openTrip === trip.tripId ? null : trip.tripId)
              }
              className="w-full p-4 text-left font-medium"
            >
              Trip {trip.tripId.slice(-6)} •{" "}
              {trip.status.toUpperCase()}
            </button>

            {openTrip === trip.tripId && (
              <div className="p-4 border-t space-y-2">
                <p>
                  {new Date(trip.startTime).toLocaleString()} →{" "}
                  {new Date(trip.endTime).toLocaleString()}
                </p>

                {trip.status === "aborted" && (
                  <p className="text-red-600">
                    Reason: {trip.abortReason}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {trip.slots.map(t => (
                    <div
                      key={t.slotPosition}
                      className="bg-slate-100 p-2 rounded text-sm"
                    >
                      <b>{t.slotPosition}</b> → {t.tireCode} (
                      {t.kmServed} km)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
