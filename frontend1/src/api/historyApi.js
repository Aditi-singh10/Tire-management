import api from "./axios";

export const getTireHistory = (tireId) =>
  api.get(`/history/tire/${tireId}`);

export const getBusHistory = (busId) =>
  api.get(`/history/bus/${busId}`);
