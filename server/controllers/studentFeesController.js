const studentFeesService = require("../services/studentFeesService");

module.exports.create = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.create(req.body);

    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.update = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.update({
      ...req.params,
      ...req.body,
    });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findOne = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.findOne(req.params);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.allStudent = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.allStudent(req.query);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.findAll(req.query);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findAllStudent = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.findAllStudent(req.query);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.allPaymentOfStudent = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.allPaymentOfStudent(
      req.query
    );
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const serviceResponse = await studentFeesService.delete(req.params);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
