import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusTripSummary } from "../../api/historyApi";
import clsx from "clsx";
import { useLanguage } from "../../i18n/LanguageContext";

export default function BusHistory() {
  const { busId } = useParams();
  const [data, setData] = useState(null);
  const [openTrip, setOpenTrip] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    getBusTripSummary(busId).then((res) => setData(res.data));
  }, [busId]);

  if (!data) return null;

  const { currentTrip, previousTrips } = data;

  const colorClasses = [
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
  ];

  const buildSlotGroups = (slots = []) => {
    const grouped = slots.reduce((acc, slot) => {
      if (!acc[slot.slotPosition]) {
        acc[slot.slotPosition] = [];
      }
      acc[slot.slotPosition].push(slot);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([slotPosition, segments]) => ({
        slotPosition,
        segments: [...segments].sort(
          (a, b) => new Date(a.mountedFrom) - new Date(b.mountedFrom),
        ),
      }))
      .sort((a, b) => a.slotPosition.localeCompare(b.slotPosition));
  };

  const renderSlots = (slots) => (
    <div className="space-y-3 mt-3">
      {buildSlotGroups(slots).map((slotGroup) => (
        <div
          key={slotGroup.slotPosition}
          className="bg-slate-100 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">{slotGroup.slotPosition}</span>
            {slotGroup.segments.length > 1 && (
              <span className="text-xs text-slate-500">
                {t("buses.replacementChain")}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {slotGroup.segments.map((segment, index) => (
              <div
                key={`${segment.tireCode}-${index}`}
                className="flex items-center gap-2"
              >
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    colorClasses[index % colorClasses.length],
                  )}
                >
                  {segment.tireCode}
                </span>
                <span className="text-xs text-slate-500">
                  {segment.kmServed} km
                </span>
                {index < slotGroup.segments.length - 1 && (
                  <span className="text-slate-400">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">🚍 {t("buses.busHistory")}</h2>

      {/* CURRENT TRIP */}
      {currentTrip && (
        <div className="mb-6 border-l-4 border-green-500 bg-green-50 p-4 rounded-xl">
          <p className="font-semibold text-green-700 mb-2"> {t("buses.ongoingTrip")}</p>

           <p>
            {t("buses.started")}:{" "}
            {new Date(currentTrip.startTime).toLocaleString()}
          </p>
          <p>
            {t("buses.distance")}: {currentTrip.distanceTravelled} km
          </p>

          {renderSlots(currentTrip.slots)}
        </div>
      )}

      {/* PREVIOUS TRIPS */}
       <h3 className="font-semibold mb-3">
        {t("buses.previousTrips")}
      </h3>


      <div className="space-y-3">
        {previousTrips.map((trip) => (
          <div
            key={trip.tripId}
            className={clsx(
              "rounded-xl border",
              trip.status === "aborted"
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white",
            )}
          >
            <button
              onClick={() =>
                setOpenTrip(openTrip === trip.tripId ? null : trip.tripId)
              }
              className="w-full p-4 text-left font-medium"
            >
             {t("buses.trip")} {trip.tripId.slice(-6)} •{" "}
              {(t(`trips.${trip.status}`) || trip.status).toUpperCase()}
            </button>

            {openTrip === trip.tripId && (
              <div className="p-4 border-t space-y-2">
                <p>
                  {new Date(trip.startTime).toLocaleString()} →{" "}
                  {new Date(trip.endTime).toLocaleString()}
                </p>

                {trip.status === "aborted" && (
                  <p className="text-red-600"> {t("buses.reason")}: {trip.abortReason}</p>
                )}

                 {renderSlots(trip.slots)}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
