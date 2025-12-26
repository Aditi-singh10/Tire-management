import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

import BusList from "../pages/Buses/BusList";
import BusDetails from "../pages/Buses/BusDetails";
import TireList from "../pages/Tires/TireList";
import TripList from "../pages/Trip/tripList";
import StartTrip from "../pages/Trip/StartTrip";
import TripDetails from "../pages/Trip/TripDetails";

import HistoryHome from "../pages/History/HistoryHome";
import TireHistory from "../pages/History/TireHistory";
import BusHistory from "../pages/History/BusHistory";
// import BusTireHistory from "../pages/History/BusTireHistory";
import { all } from "axios";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/buses" element={<BusList />} />
          <Route path="/buses/:id" element={<BusDetails />} />

          <Route path="/tires" element={<TireList />} />

          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/start" element={<StartTrip />} />
          <Route path="/trips/:id" element={<TripDetails />} />

          <Route path="/history" element={<HistoryHome />} />
          <Route path="/history/tire/:id" element={<TireHistory />} />
          <Route path="/history/bus-summary/:busId" element={<BusHistory />} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  );
}
