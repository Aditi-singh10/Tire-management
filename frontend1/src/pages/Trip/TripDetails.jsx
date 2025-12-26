import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getTripById, endTrip } from "../../api/tripApi";
import AddEventModal from "./addEventModal";
import EndTripModal from "./EndTrip";
import { useNavigate } from "react-router-dom";

export default function TripDetails() {
  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [showEvent, setShowEvent] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

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
      <h2 className="text-2xl font-bold mb-4">Trip Details</h2>

      {/* Summary */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <p>
          <span className="text-slate-500">Bus:</span>{" "}
          <b>{trip.busId.busNumber}</b>
        </p>

        <p>
          <span className="text-slate-500">
            {trip.endStatus === "aborted"
              ? "Distance Travelled:"
              : "Planned Distance:"}
          </span>{" "}
          <span className="font-medium">
            {trip.endStatus === "aborted"
              ? trip.actualDistance
              : trip.totalDistance}{" "}
            km
          </span>
        </p>

        <p>
          <span className="text-slate-500">Status:</span>{" "}
          {trip.endStatus === "aborted" ? (
            <span className="text-red-600 font-semibold">Aborted</span>
          ) : isActive ? (
            <span className="text-orange-600 font-semibold">Ongoing</span>
          ) : (
            <span className="text-green-600 font-semibold">Completed</span>
          )}
        </p>

        {/* Reason — ONLY FOR ABORTED */}
        {trip.endStatus === "aborted" && (
          <p>
            <span className="text-slate-500">Reason:</span>{" "}
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
            + Add Event
          </button>

          <button
            onClick={() => setShowEndModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            End Trip
          </button>
        </div>
      )}

      {/* Events Timeline */}
      <h3 className="font-semibold mb-2">Events</h3>

      {!trip.events.length && (
        <p className="text-slate-500">No events recorded.</p>
      )}

      <div className="space-y-3">
        {trip.events.map((e, idx) => (
          <div key={idx} className="bg-slate-100 p-3 rounded-lg">
            <p className="font-medium">
              {e.type.toUpperCase()} – {e.slotPosition}
            </p>
            <p className="text-sm text-slate-600">
              Distance: {e.distanceAtEvent} km
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
