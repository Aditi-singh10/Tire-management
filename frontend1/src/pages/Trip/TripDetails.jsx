import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import AddEventModal from "./addEventModal";
import { endTrip } from "../../api/tripApi";

export default function TripDetails() {
  const { id } = useParams();
  const [showEvent, setShowEvent] = useState(false);

  const handleEndTrip = async () => {
    await endTrip(id);
    alert("Trip ended successfully");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">
        Trip Details
      </h2>

      <div className="flex gap-4">
        <button
          onClick={() => setShowEvent(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add Puncture Event
        </button>

        <button
          onClick={handleEndTrip}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          End Trip
        </button>
      </div>

      {showEvent && (
        <AddEventModal
          tripId={id}
          onClose={() => setShowEvent(false)}
        />
      )}
    </motion.div>
  );
}
