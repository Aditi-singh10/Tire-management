const historyService = require("../services/historyService");

exports.getTireHistory = async (req, res) => {
  res.json(await historyService.getTireHistory(req.params.tireId));
};

exports.getBusHistory = async (req, res) => {
  res.json(await historyService.getBusHistory(req.params.busId));
};

exports.getBusTripHistory = async (req, res) => {
  const data = await historyService.getBusTripHistory(req.params.busId);
  res.json(data);
};

exports.getBusTripSummary = async (req, res) => {
  const data = await historyService.getBusTripSummary(req.params.busId);
  res.json(data);
};
