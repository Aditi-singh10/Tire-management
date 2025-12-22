import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-white shadow-sm flex items-center px-6 fixed top-0 left-64 right-0 z-10"
    >
      <h1 className="text-lg font-semibold text-slate-800">
        Fleet Management System
      </h1>
    </motion.header>
  );
}
