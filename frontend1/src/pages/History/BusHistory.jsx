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

  const renderSlots = (slots = []) => {
    const visibleSlots = slots.filter(
      (slot) => slot.slotPosition?.toLowerCase() !== "emergency",
    );

    if (!visibleSlots.length) {
      return null;
    }

    return (
      <div className="grid grid-cols-2 gap-2 mt-3">
        {visibleSlots.map((slot) => (
          <div
            key={`${slot.slotPosition}-${slot.tireCode}`}
            className="bg-white p-2 rounded shadow text-sm"
          >
            <b>{slot.slotPosition}</b> → {slot.tireCode}
            <div className="text-xs text-slate-500">{slot.kmServed} km</div>
          </div>
        ))}
      </div>
    );
  };

  const replacementColors = [
    {
      border: "border-indigo-200",
      bg: "bg-indigo-50",
      chip: "bg-indigo-100 text-indigo-700",
    },
    {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      chip: "bg-emerald-100 text-emerald-700",
    },
    {
      border: "border-amber-200",
      bg: "bg-amber-50",
      chip: "bg-amber-100 text-amber-700",
    },
    {
      border: "border-sky-200",
      bg: "bg-sky-50",
      chip: "bg-sky-100 text-sky-700",
    },
    {
      border: "border-fuchsia-200",
      bg: "bg-fuchsia-50",
      chip: "bg-fuchsia-100 text-fuchsia-700",
    },
  ];

  const renderReplacements = (replacements = []) => {
    if (!replacements.length) {
      return null;
    }

    return (
      <div className="mt-4">
        <p className="text-sm font-semibold mb-2">
          {t("buses.replacementChain")}
        </p>
        <div className="space-y-2">
          {replacements.map((replacement, index) => {
            const color = replacementColors[index % replacementColors.length];
            return (
              <div
                key={`${replacement.slotPosition || "slot"}-${index}`}
                className={clsx(
                  "flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm",
                  color.border,
                  color.bg,
                )}
              >
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    color.chip,
                  )}
                >
                  {replacement.removedTire}
                </span>
                <span className="text-xs text-slate-500">
                  {t("buses.replaced")}
                </span>
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    color.chip,
                  )}
                >
                  {replacement.installedTire}
                </span>
                {replacement.slotPosition && (
                  <span className="text-xs text-slate-500">
                    • {t("buses.slot")} {replacement.slotPosition}
                  </span>
                )}
                {replacement.distanceAtEvent !== null && (
                  <span className="text-xs text-slate-500">
                    • {replacement.distanceAtEvent} km
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">🚍 {t("buses.busHistory")}</h2>

      {/* CURRENT TRIP */}
      {currentTrip && (
        <div className="mb-6 border-l-4 border-green-500 bg-green-50 p-4 rounded-xl">
          <p className="font-semibold text-green-700 mb-2">
            {" "}
            {t("buses.ongoingTrip")}
          </p>

          <p>
            {t("buses.started")}:{" "}
            {new Date(currentTrip.startTime).toLocaleString()}
          </p>
          <p>
            {t("buses.distance")}: {currentTrip.distanceTravelled} km
          </p>

          {renderSlots(currentTrip.slots)}
          {renderReplacements(currentTrip.replacements)}
        </div>
      )}

      {/* PREVIOUS TRIPS */}
      <h3 className="font-semibold mb-3">{t("buses.previousTrips")}</h3>

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
                  <p className="text-red-600">
                    {" "}
                    {t("buses.reason")}: {trip.abortReason}
                  </p>
                )}

                {renderSlots(trip.slots)}
                {renderReplacements(trip.replacements)}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
