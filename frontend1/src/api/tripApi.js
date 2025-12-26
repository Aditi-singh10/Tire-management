import api from "./axios";

export const startTrip = (data) =>
  api.post("/trips/start", data);

export const addTripEvent = (tripId, data) =>
  api.post(`/trips/${tripId}/event`, data);

export const endTrip = (tripId, data) =>
  api.post(`/trips/${tripId}/end`, data);

export const getTripById = (tripId) => {
  if (!tripId) {
    return Promise.reject("Trip ID missing");
  }
  return api.get(`/trips/${tripId}`);
};
