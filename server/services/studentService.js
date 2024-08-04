const serverResponse = require("../constants/serverResponse");
const { commanMessage, studentMessage } = require("../constants/message");
const lodash = require("lodash");
const Student = require("../models/studentModel");
const { formData } = require("../utils/mongooseUtills");

module.exports.create = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const existStudent = await Student.findOne({
      admin: serviceData.admin,
      firstName: serviceData.firstName,
      lastName: serviceData.lastName,
      batch: serviceData.batch,
    });

    if (existStudent) {
      response.message = studentMessage.STUDENT_EXIST;
      response.errors.firstName = `${serviceData.firstName} already exists`;
      return response;
    }

    const student = await Student.create(serviceData);

    await student.save();

    response.status = 200;
    response.message = studentMessage.STUDENT_CREATED;
    response.body = formData(student);
    return response;
  } catch (error) {
    response.message = commanMessage.SOMETHING_WENT_WRONG;
    response.errors = error;
    return response;
  }
};

module.exports.update = async (serviceData, updateData) => {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const student = await Student.findByIdAndUpdate(
      {
        _id: serviceData.id,
        admin: serviceData.admin,
      },
      updateData,
      {
        new: true,
      }
    );

    if (!student) {
      response.errors.error = studentMessage.STUDENT_NOT_FOUND;
      response.message = studentMessage.STUDENT_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = studentMessage.STUDENT_UPDATED_SUCCESSFULLY;
    response.body = formData(student);
    return response;
  } catch (error) {
    response.errors = error;
    response.message = error.message;
    return response;
  }
};

module.exports.findOne = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const student = await Student.findOne({
      _id: serviceData.id,
      admin: serviceData.admin,
    }).populate({ path: "batch", select: "batchName" });

    if (!student) {
      response.errors.error = studentMessage.STUDENT_NOT_FOUND;
      response.message = studentMessage.STUDENT_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = studentMessage.STUDENT_GET_SUCCESSFULLY;
    response.body = formData(student);
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.findAll = async ({
  limit = 10,
  page = 1,
  status = true,
  searchQuery,
  batch,
}) => {
  const response = lodash.cloneDeep(serverResponse);

  let conditions = {
    isDeleted: false,
  };

  if (batch) conditions.batch = batch;

  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: "i" };

    conditions.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { batchName: searchRegex },
    ];
  }

  if (status == "All") {
    delete conditions.status;
  } else {
    conditions.status = status == "false" ? false : true;
  }

  try {
    const totalRecords = await Student.countDocuments(conditions);

    const totalPage = Math.ceil(totalRecords / parseInt(limit));

    const student = await Student.find(conditions)
      .populate({
        path: "batch",
        select: "_id batchName",
      })
      .sort({ _id: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    if (!student) {
      response.errors.error = studentMessage.STUDENT_NOT_FOUND;
      response.message = studentMessage.STUDENT_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = studentMessage.ALL_STUDENT_GET_SUCCESSFULLY;
    response.body = formData(student);
    response.page = parseInt(page);
    response.totalRecords = totalRecords;
    response.totalPage = totalPage;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.delete = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const student = await Student.findByIdAndUpdate(
      { _id: serviceData.id, admin: serviceData.admin },
      {
        isDeleted: true,
      }
    );

    if (!student) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { id: commanMessage.INVALID_ID };
    }

    response.status = 200;
    response.message = studentMessage.STUDENT_DELETED;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};
