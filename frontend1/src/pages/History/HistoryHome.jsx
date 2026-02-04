import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

export default function HistoryHome() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4">
         {t("history.title")}
      </h2>

      <p className="text-slate-600 mb-4">
         {t("history.homeIntro")}
      </p>

      <div className="bg-white p-6 rounded-xl shadow">
        <ul className="list-disc ml-6 text-slate-700 space-y-2">
          <li>
             {t("history.homeStepBus")}
          </li>
          <li>
              {t("history.homeStepTire")}
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
