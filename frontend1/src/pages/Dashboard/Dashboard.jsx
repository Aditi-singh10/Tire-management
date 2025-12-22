import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-primary">
        Fleet Management Dashboard
      </h1>
      <p className="mt-2 text-slate-900">Frontend is up and running 🚀</p>
      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
        Tailwind is working 🚀
      </div>
    </motion.div>
  );
}
