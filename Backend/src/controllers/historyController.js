const historyService = require("../services/historyService");

exports.getTireHistory = async (req, res) => {
  res.json(await historyService.getTireHistory(req.params.tireId));
};

exports.getBusHistory = async (req, res) => {
  res.json(await historyService.getBusHistory(req.params.busId));
};
