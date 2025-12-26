import { motion } from "framer-motion";

export default function HistoryHome() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        History
      </h2>

      <p className="text-slate-600 mb-4">
        History is shown based on Bus or Tire.
      </p>

      <div className="bg-white p-6 rounded-xl shadow">
        <ul className="list-disc ml-6 text-slate-700 space-y-2">
          <li>
            Go to <b>Buses</b> → select a bus → click{" "}
            <b>View Tire History</b>
          </li>
          <li>
            Go to <b>Tires</b> → select a tire → view history
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
