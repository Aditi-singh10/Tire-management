import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-800">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Buses" value="12" />
        <StatCard title="Active Tires" value="96" />
        <StatCard title="Running Trips" value="3" />
      </div>
    </motion.div>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl p-6 shadow-md"
    >
      <p className="text-slate-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800 mt-2">
        {value}
      </h3>
    </motion.div>
  );
}
