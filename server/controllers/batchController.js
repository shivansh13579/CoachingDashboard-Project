const batchService = require("../services/batchService");

module.exports.create = async (req, res) => {
  try {
    const admin = req.admin._id;
    const serviceResponse = await batchService.create({
      admin,
      ...req.body,
    });

    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const admin = req.admin._id;
    const serviceResponse = await batchService.update(
      { id, admin },
      updateData
    );
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id } = req.admin;
    const serviceResponse = await batchService.findOne({ id, _id });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const admin = req.admin._id;
    const serviceResponse = await batchService.findAll({
      ...req.query,
      admin,
    });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.admin._id;
    const serviceResponse = await batchService.delete({ id, admin });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
