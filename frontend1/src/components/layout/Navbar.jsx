import { motion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-white shadow-sm flex items-center px-6 fixed top-0 left-64 right-0 z-10"
    >
      <h1 className="text-lg font-semibold text-slate-800">
        {t("app.title")}
      </h1>
       <div className="ml-auto flex items-center gap-2 text-sm text-slate-600">
        <label htmlFor="language-select" className="font-medium">
          {t("app.language")}
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
        >
          <option value="en">{t("app.english")}</option>
          <option value="hi">{t("app.hindi")}</option>
        </select>
      </div>
    </motion.header>
  );
}
