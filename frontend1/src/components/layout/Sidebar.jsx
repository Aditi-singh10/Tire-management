import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bus,
  Disc3,
  Route,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useLanguage } from "../../i18n/LanguageContext";

export default function Sidebar() {
  const { t } = useLanguage();
  const menu = [
    { name: t("nav.buses"), icon: Bus, path: "/buses" },
    { name: t("nav.tires"), icon: Disc3, path: "/tires" },
    { name: t("nav.trips"), icon: Route, path: "/trips" },
    { name: t("nav.history"), icon: History, path: "/history" },
  ];

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0"
    >
      <div className="p-6 text-xl font-bold tracking-wide border-b border-slate-700">
        {t("app.admin")}
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {menu.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <Icon size={20} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
