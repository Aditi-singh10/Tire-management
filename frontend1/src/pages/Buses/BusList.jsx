import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBuses } from "../../api/busApi";

export default function BusList() {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBuses().then((res) => setBuses(res.data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Buses</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Bus Number</th>
              <th className="p-4">Type</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus) => (
              <tr
                key={bus._id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {bus.busNumber}
                </td>
                <td className="p-4">{bus.type || "-"}</td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/buses/${bus._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
