import clsx from "clsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TireCard({ tire }) {
  const navigate = useNavigate();
  const tireCode = tire?.tireCode ?? "N/A";
  const kmUsed = tire?.kmUsed ?? 0;
  const maxKm = tire?.maxKm ?? 0;
  const status = tire?.status ?? "unknown";

  const usage =
    maxKm > 0 ? Math.min((kmUsed / maxKm) * 100, 100) : 0;

  return (
    <motion.div  onClick={() => navigate(`/history/tire/${tire._id}`)}
    className="bg-white rounded-xl shadow p-5">
      
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{tireCode}</h3>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">
          {status.toUpperCase()}
        </span>
      </div>

      <p>Used: {kmUsed} km</p>
      <p>Max: {maxKm} km</p>
      <p>Usage: {usage.toFixed(1)}%</p>

      <div className="mt-2 bg-gray-200 h-2 rounded">
        <div
          className={clsx(
            "h-2 rounded",
            usage < 70 && "bg-green-500",
            usage >= 70 && usage < 90 && "bg-orange-500",
            usage >= 90 && "bg-red-500"
          )}
          style={{ width: `${usage}%` }}
        />
      </div>
    </motion.div>
  );
}
