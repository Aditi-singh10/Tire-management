import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBusHistory } from "../../api/historyApi";
import TimelineItem from "./TimelineItem";

export default function BusHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getBusHistory(id).then((res) => setHistory(res.data));
  }, [id]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">
        Bus Tire Usage Timeline
      </h2>

      <div className="bg-white rounded-xl p-6 shadow">
        {history.map((item, idx) => (
          <TimelineItem
            key={item._id}
            item={item}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
