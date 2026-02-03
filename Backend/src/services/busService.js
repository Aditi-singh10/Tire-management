const Bus = require("../models/busModel");

exports.createBus = async (data) => {
  return await Bus.create(data);
};

exports.getAllBuses = async () => {
  return await Bus.find();
};

exports.getBusById = async (id) => {
  return await Bus.findById(id).populate("emergencyTires");
};
