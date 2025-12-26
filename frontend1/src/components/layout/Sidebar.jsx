import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bus,
  Disc3,
  Route,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Buses", icon: Bus, path: "/buses" },
  { name: "Tires", icon: Disc3, path: "/tires" },
  { name: "Trips", icon: Route, path: "/trips" },
  { name: "History", icon: History, path: "/history" },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0"
    >
      <div className="p-6 text-xl font-bold tracking-wide border-b border-slate-700">
        Fleet Admin
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
