import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import clsx from "clsx";

const iconMap = {
  puncture: AlertTriangle,
  trip_end: CheckCircle,
  expired: XCircle,
};

const colorMap = {
  puncture: "bg-orange-100 text-orange-600",
  trip_end: "bg-green-100 text-green-600",
  expired: "bg-red-100 text-red-600",
};

export default function TimelineItem({ item, isLast }) {
  const Icon = iconMap[item.removalReason] || CheckCircle;
  const pillColor = item.isEmergency
    ? "bg-amber-100 text-amber-700"
    : "bg-blue-100 text-blue-600";
  //  Duration (hours)
  const durationHours =
    item.endTime &&
    Math.round(
      (new Date(item.endTime) - new Date(item.startTime)) / (1000 * 60 * 60)
    );

  //  Usage %
  const usagePercent = item.tireId?.maxLifeKm
    ? Math.round((item.kmServed / item.tireId.maxLifeKm) * 100)
    : null;

  return (
    <div className="flex gap-4">
      {/* ICON */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center",
            colorMap[item.removalReason]
          )}
        >
          <Icon size={20} />
        </motion.div>

        {!isLast && <div className="w-px h-full bg-slate-300 mt-2" />}
      </div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pb-8"
      >
        {/* Reason */}
        <p className="font-semibold">
         {item.isEmergency
            ? "EMERGENCY TIRE"
            : item.removalReason === "trip_end"
            ? "TRIP COMPLETED"
            : item.removalReason
            ? item.removalReason.replace("_", " ").toUpperCase()
            : "MOUNTED"}
        </p>

        {/* Bus */}
        {item.busId?.busNumber && (
          <p className="text-sm text-slate-700">
            Bus: <b>{item.busId.busNumber}</b>
          </p>
        )}

        {/* Slot */}
         {item.slotPosition && !item.isEmergency && (
          <p className="text-sm text-slate-700">
            Slot: <b>{item.slotPosition}</b>
          </p>
        )}

        {/* Tire */}
        {item.tireId?.tireCode && (
          <p className="text-sm text-slate-700">
            Tire: <b>{item.tireId.tireCode}</b>
          </p>
        )}

        {/* KM */}
        <p className="text-sm text-slate-600">Distance: {item.kmServed} km</p>

        {/* Usage */}
        {item.tireId?.maxLifeKm ? (
          <p className="text-sm text-slate-600">
            Usage: {Math.round((item.kmServed / item.tireId.maxLifeKm) * 100)}%
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">Usage: N/A</p>
        )}

        {/* Duration */}
        {durationHours && (
          <p className="text-sm text-slate-600">
            Duration: {durationHours} hrs
          </p>
        )}

        {/* Active Status */}
        {!item.endTime && (
           <span
            className={`inline-block mt-1 text-xs px-2 py-1 rounded ${pillColor}`}
          >
            {item.isEmergency
              ? "Currently Carried"
              : "Currently Mounted"}
          </span>
        )}

        {/* Time */}
        <p className="text-xs text-slate-400 mt-1">
          {new Date(item.startTime).toLocaleString()} →{" "}
          {item.endTime ? new Date(item.endTime).toLocaleString() : "Active"}
        </p>
      </motion.div>
    </div>
  );
}
