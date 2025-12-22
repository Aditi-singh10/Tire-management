import api from "./axios";

export const getBuses = () => api.get("/buses");
export const getBusById = (id) => api.get(`/buses/${id}`);
export const getBusTireSlots = (busId) =>
  api.get(`/bus-tire-slots/${busId}`);

export const mountTire = (data) =>
  api.post("/bus-tire-slots", data);
