import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import clsx from "clsx";

const statusColor = {
  available: "bg-green-100 text-green-700",
  mounted: "bg-blue-100 text-blue-700",
  punctured: "bg-red-100 text-red-700",
  expired: "bg-orange-100 text-orange-700",
  repaired: "bg-purple-100 text-purple-700",
};

export default function TireCard({ tire, onRepair }) {
  const lifePercent = Math.min(
    (tire.currentLifeKm / tire.maxLifeKm) * 100,
    100
  );

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">
            {tire.tireCode}
          </h3>
          <span
            className={clsx(
              "text-xs px-3 py-1 rounded-full font-medium",
              statusColor[tire.status]
            )}
          >
            {tire.status.toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-slate-500 mt-2">
          Max Life: {tire.maxLifeKm} km
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Usage</span>
            <span>{Math.round(lifePercent)}%</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${lifePercent}%` }}
            />
          </div>
        </div>
      </div>

      {tire.status === "expired" && (
        <button
          onClick={onRepair}
          className="mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800"
        >
          <Wrench size={16} />
          Repair Tire
        </button>
      )}
    </motion.div>
  );
}
