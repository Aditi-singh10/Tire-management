import api from "./axios";

export const startTrip = (data) =>
  api.post("/trips/start", data);

export const addTripEvent = (tripId, data) =>
  api.post(`/trips/${tripId}/event`, data);

export const endTrip = (tripId) =>
  api.post(`/trips/${tripId}/end`);

export const getTripById = (tripId) =>
  api.get(`/trips/${tripId}`);
