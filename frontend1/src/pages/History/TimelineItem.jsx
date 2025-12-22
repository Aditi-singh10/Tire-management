import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
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

  return (
    <div className="flex gap-4">
      {/* Left line + icon */}
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

        {!isLast && (
          <div className="w-px h-full bg-slate-300 mt-2" />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pb-8"
      >
        <p className="font-semibold">
          {item.removalReason?.replace("_", " ").toUpperCase()}
        </p>

        <p className="text-sm text-slate-500">
          Slot: {item.slotPosition}
        </p>

        <p className="text-sm text-slate-500">
          Distance Served: {item.kmServed} km
        </p>

        <p className="text-xs text-slate-400 mt-1">
          {new Date(item.startTime).toLocaleString()} →
          {item.endTime
            ? new Date(item.endTime).toLocaleString()
            : " Active"}
        </p>
      </motion.div>
    </div>
  );
}
