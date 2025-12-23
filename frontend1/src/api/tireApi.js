import api from "./axios";

export const getTires = () => api.get("/tires");
export const getTireById = (id) => api.get(`/tires/${id}`);

export const createTire = (data) =>
  api.post("/tires", data);

export const repairTire = (id, data) =>
  api.post(`/tires/${id}/repair`, data);
