import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "../../i18n/LanguageContext";

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
     const { t } = useLanguage();
  const translatedReason = item.removalReason
    ? t(`history.reason.${item.removalReason}`)
    : t("history.mountedLabel");
  const reasonLabel =
    translatedReason?.startsWith("history.reason.")
      ? item.removalReason?.replace("_", " ").toUpperCase()
      : translatedReason;

  //  Duration (hours)
   const durationHours = item.endTime
    ? Math.round(
        (new Date(item.endTime) - new Date(item.startTime)) / (1000 * 60 * 60)
      )
    : null;

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
           ? t("history.emergencyTire")
            : reasonLabel}
        </p>

        {/* Bus */}
        {item.busId?.busNumber && (
          <p className="text-sm text-slate-700">
            {t("history.bus")}: <b>{item.busId.busNumber}</b>
          </p>
        )}

        {/* Slot */}
         {item.slotPosition && !item.isEmergency && (
          <p className="text-sm text-slate-700">
            {t("history.slot")}: <b>{item.slotPosition}</b>
          </p>
        )}

        {/* Tire */}
         {(item.tireCodeSnapshot || item.tireId?.tireCode) && (
          <p className="text-sm text-slate-700">
            {t("history.tire")}:{" "}
            <b>{item.tireCodeSnapshot || item.tireId?.tireCode}</b>
          </p>
        )}

        {/* KM */}
          <p className="text-sm text-slate-600">
          {t("history.distance")}: {item.kmServed} km
        </p>

        {/* Usage */}
        {item.tireId?.maxLifeKm ? (
          <p className="text-sm text-slate-600">
           {t("history.usage")}:{" "}
            {Math.round((item.kmServed / item.tireId.maxLifeKm) * 100)}%
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">
            {t("history.usage")}: {t("common.na")}
          </p>
        )}

        {/* Duration */}
        {/* {durationHours  !== null && (
          <p className="text-sm text-slate-600">
             {t("history.duration")}: {durationHours} hrs
          </p>
        )} */}

        {/* Active Status */}
        {!item.endTime && (
           <span
            className={`inline-block mt-1 text-xs px-2 py-1 rounded ${pillColor}`}
          >
            {item.isEmergency
              ? t("history.currentlyCarried")
              : t("history.currentlyMounted")}
          </span>
        )}

        {/* Time */}
        <p className="text-xs text-slate-400 mt-1">
          {new Date(item.startTime).toLocaleString()} →{" "}
         {item.endTime ? new Date(item.endTime).toLocaleString() : t("history.active")}
        </p>
      </motion.div>
    </div>
  );
}
