const studentService = require("../services/studentService");

module.exports.create = async (req, res) => {
  try {
    const admin = req.admin._id;
    const serviceResponse = await studentService.create({
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
    const serviceResponse = await studentService.update(
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
    const admin = req.admin._id;
    const serviceResponse = await studentService.findOne({ id, admin });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const serviceResponse = await studentService.findAll(req.query);
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.admin._id;
    const serviceResponse = await studentService.delete({ id, admin });
    res.status(serviceResponse.status).send(serviceResponse);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
