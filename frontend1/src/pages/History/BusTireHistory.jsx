// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getBusTripHistory } from "../../api/historyApi";

// export default function BusTireHistory() {
//   const { busId } = useParams();
//   const [data, setData] = useState(null);
//   const [openTrip, setOpenTrip] = useState(null);

//   useEffect(() => {
//     getBusTripHistory(busId).then(res => setData(res.data));
//   }, [busId]);

//   if (!data) return null;

//   const { currentTrip, previousTrips } = data;

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <h2 className="text-2xl font-bold mb-6">
//         Bus Tire History
//       </h2>

//       {/* CURRENT TRIP */}
//       {currentTrip && (
//         <div className="bg-white p-4 rounded-xl shadow mb-6">
//           <h3 className="font-semibold mb-2">Current Trip</h3>
//           <p>Trip ID: {currentTrip._id}</p>
//           <p>Start: {new Date(currentTrip.startTime).toLocaleString()}</p>

//           <div className="mt-3 space-y-1">
//             {currentTrip.slots.map(t => (
//               <p key={t._id}>
//                 {t.slotPosition} → {t.tireId.tireCode}
//               </p>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* PREVIOUS TRIPS */}
//       <div className="space-y-3">
//         {previousTrips.map(trip => (
//           <div key={trip._id} className="bg-white rounded-xl shadow">
//             <button
//               onClick={() =>
//                 setOpenTrip(openTrip === trip._id ? null : trip._id)
//               }
//               className="w-full text-left p-4 font-semibold"
//             >
//               Trip {trip._id.slice(-6)} |{" "}
//               {new Date(trip.startTime).toLocaleDateString()}
//             </button>

//             {openTrip === trip._id && (
//               <div className="p-4 border-t space-y-2">
//                 <p>
//                   {new Date(trip.startTime).toLocaleString()} →{" "}
//                   {new Date(trip.endTime).toLocaleString()}
//                 </p>

//                 {trip.tires.map(t => (
//                   <p key={t._id}>
//                     {t.slotPosition} → {t.tireId.tireCode} (
//                     {t.kmServed} km)
//                   </p>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }
