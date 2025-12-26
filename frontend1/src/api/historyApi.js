import api from "./axios";

export const getTireHistory = (tireId) =>
  api.get(`/history/tire/${tireId}`);

export const getBusHistory = (busId) =>
  api.get(`/history/bus/${busId}`);

export const getBusTripHistory = (busId) =>
  api.get(`/history/bus-trips/${busId}`);

export const getBusTripSummary = (busId) =>
  api.get(`/history/bus-trip-summary/${busId}`);