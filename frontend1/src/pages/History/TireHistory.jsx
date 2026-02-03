import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTireHistory } from "../../api/historyApi";
import TimelineItem from "./TimelineItem";

export default function TireHistory() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getTireHistory(id).then(res => setData(res.data));
  }, [id]);

  if (!data) return null;

  const { current, history } = data;

  return (
    <div>
      {/*  CURRENT STATUS */}
      <div className="bg-blue-50 p-4 rounded-xl mb-6">
        <h2 className="font-bold text-xl">
          Tire History
        </h2>

        {current ? (
          <>
            <p>
            {current.isEmergency
                ? "Currently carried as an emergency tire on "
                : "Currently mounted on "}
              <b>{current.busNumber}</b>
            </p>
             {current.slotPosition && !current.isEmergency && (
              <p>
                Slot: <b>{current.slotPosition}</b>
              </p>
            )}
            <p>
              Mounted since:{" "}
              {new Date(current.startTime).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="italic text-slate-500">
            Not mounted on any bus
          </p>
        )}
      </div>

      {/*  HISTORY TIMELINE */}
      <div className="bg-white p-4 rounded-xl">
        {history.map((item, idx) => (
          <TimelineItem
            key={item._id}
            item={item}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
