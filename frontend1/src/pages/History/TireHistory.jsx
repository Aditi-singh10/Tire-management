import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTireHistory } from "../../api/historyApi";
import TimelineItem from "./TimelineItem";
import { useLanguage } from "../../i18n/LanguageContext";

export default function TireHistory() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    getTireHistory(id).then(res => setData(res.data));
  }, [id]);

  if (!data) return null;

  const { current, history, metrics } = data;

  return (
    <div>
      {/*  CURRENT STATUS */}
      <div className="bg-blue-50 p-4 rounded-xl mb-6">
        <h2 className="font-bold text-xl">
           {t("history.tireHistory")}
        </h2>

        {current ? (
          <>
            <p>
            {current.isEmergency
                 ? t("buses.currentlyEmergency")
                : t("buses.currentlyMounted")}{" "}
              <b>{current.busNumber}</b>
            </p>
             {current.slotPosition && !current.isEmergency && (
              <p>
                 {t("history.slot")}: <b>{current.slotPosition}</b>
              </p>
            )}
            <p>
              {t("buses.mountedSince")}:{" "}
              {new Date(current.startTime).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="italic text-slate-500">
            {t("buses.notMounted")}
          </p>
        )}
          {metrics && (
          <div className="mt-3 text-sm text-slate-700">
            <p className="font-semibold">
              {t("tires.totalDistance")}: {metrics.totalDistance} km
            </p>
            {metrics.hasRepairHistory ? (
              <p className="text-slate-600">
                {t("tires.pastDistance")}: {metrics.pastDistance} km •{" "}
                {t("tires.currentDistance")}: {metrics.currentDistance} km
              </p>
            ) : null}
            {metrics.hasRepairHistory ? (
              <p className="text-slate-500">
                {t("tires.totalDistanceFormula", {
                  past: metrics.pastDistance,
                  current: metrics.currentDistance,
                  total: metrics.totalDistance,
                })}
              </p>
            ) : null}
          </div>
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
