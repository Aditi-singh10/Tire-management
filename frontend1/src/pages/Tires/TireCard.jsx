import clsx from "clsx";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export default function TireCard({ tire, onRepair }) {
  const navigate = useNavigate();
  const tireCode = tire?.tireCode ?? "N/A";
  const kmUsed = tire?.kmUsed ?? 0;
  const maxKm = tire?.maxKm ?? 0;
  const status = tire?.status ?? "unknown";
  const canRepair = status === "expired" || status === "punctured";
  const { t } = useLanguage();
  const usage =
    maxKm > 0 ? Math.min((kmUsed / maxKm) * 100, 100) : 0;

  return (
    <motion.div
      onClick={() => navigate(`/history/tire/${tire._id}`)}
      className="bg-white rounded-xl shadow p-5"
    >
      
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{tireCode}</h3>
        <div className="flex items-center gap-2">
          {canRepair && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRepair?.(tire);
              }}
              className="text-xs px-2 py-1 rounded bg-blue-600 text-white"
            >
               {t("tires.repair")}
            </button>
          )}
          <span className="text-xs px-2 py-1 rounded bg-gray-100">
             {(t(`tires.status.${status}`) || status).toUpperCase()}
          </span>
        </div>
      </div>

      <p>
        {t("tires.currentLife")}: {kmUsed} km
      </p>
      <p>
        {t("tires.maxLife")}: {maxKm} km
      </p>
      <p>
        {t("history.usage")}: {usage.toFixed(1)}%
      </p>

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
