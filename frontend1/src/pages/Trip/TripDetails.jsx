import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getTripById, endTrip } from "../../api/tripApi";
import AddEventModal from "./addEventModal";
import EndTripModal from "./EndTrip";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export default function TripDetails() {
  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [showEvent, setShowEvent] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
   const { t } = useLanguage();
  const loadTrip = async () => {
    const res = await getTripById(tripId);
    setTrip(res.data);
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  if (!trip) return null;

  const isActive = !trip.endTime;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
       <h2 className="text-2xl font-bold mb-4">
        {t("trips.tripDetails")}
      </h2>
      {/* Summary */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <p>
          <span className="text-slate-500">
            {t("trips.bus")}:
          </span>{" "}
          <b>{trip.busId.busNumber}</b>
        </p>

        <p>
          <span className="text-slate-500">
            {trip.endStatus === "aborted"
              ? t("trips.distanceTravelled")
              : t("trips.plannedDistance")}
          </span>{" "}
          <span className="font-medium">
            {trip.endStatus === "aborted"
              ? trip.actualDistance
              : trip.totalDistance}{" "}
            km
          </span>
        </p>

        <p>
           <span className="text-slate-500">{t("common.status")}:</span>{" "}
          {trip.endStatus === "aborted" ? (
           <span className="text-red-600 font-semibold">
              {t("trips.aborted")}
            </span>
          ) : isActive ? (
             <span className="text-orange-600 font-semibold">
              {t("trips.ongoing")}
            </span>
          ) : (
             <span className="text-green-600 font-semibold">
              {t("trips.completed")}
            </span>
          )}
        </p>

        {/* Reason — ONLY FOR ABORTED */}
        {trip.endStatus === "aborted" && (
          <p>
             <span className="text-slate-500">{t("buses.reason")}:</span>{" "}
            <span className="text-red-500 font-medium">
              {trip.endReason || "—"}
            </span>
          </p>
        )}
      </div>

      {/* Actions */}
      {isActive && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowEvent(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
           + {t("trips.addEvent")}
          </button>

          <button
            onClick={() => setShowEndModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
             {t("trips.endTrip")}
          </button>
        </div>
      )}

      {/* Events Timeline */}
     <h3 className="font-semibold mb-2">{t("trips.events")}</h3>

      {!trip.events.length && (
           <p className="text-slate-500">{t("trips.noEvents")}</p>
      )}

      <div className="space-y-3">
        {trip.events.map((e, idx) => (
          <div key={idx} className="bg-slate-100 p-3 rounded-lg">
            <p className="font-medium">
              {e.type.toUpperCase()} – {e.slotPosition}
            </p>
            <p className="text-sm text-slate-600">
               {t("buses.distance")}: {e.distanceAtEvent} km
            </p>
          </div>
        ))}
      </div>

      {showEvent && (
        <AddEventModal
          tripId={tripId}
          onClose={() => {
            setShowEvent(false);
            loadTrip();
          }}
        />
      )}

      {showEndModal && (
        <EndTripModal
          tripId={trip._id}
          onClose={() => setShowEndModal(false)}
          onSuccess={() => navigate("/trips")}
        />
      )}
    </motion.div>
  );
}
