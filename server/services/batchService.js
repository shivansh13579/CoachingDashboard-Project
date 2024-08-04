const lodash = require("lodash");
const serverResponse = require("../constants/serverResponse");
const Batch = require("../models/batchModel");
const { batchMessage, commanMessage } = require("../constants/message");
const { formData } = require("../utils/mongooseUtills");
const response = lodash.cloneDeep(serverResponse);

module.exports.create = async (serviceData) => {
  try {
    const existBatch = await Batch.findOne({
      batchName: serviceData.batchName,
      admin: serviceData.admin,
    });

    if (existBatch) {
      response.message = batchMessage.BATCH_EXIST;
      response.errors = `${serviceData.batchName} already exist`;
      return response;
    }

    const batch = await Batch.create(serviceData);

    await batch.save();

    response.status = 200;
    response.message = batchMessage.BATCH_CREATED;
    response.body = formData(batch);
    return response;
  } catch (error) {
    response.message = commanMessage.SOMETHING_WENT_WRONG;
    response.errors = error;
    return response;
  }
};

module.exports.update = async (serviceData, updateData) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      { _id: serviceData.id, admin: serviceData.admin },
      updateData,
      {
        new: true,
      }
    );

    if (!batch) {
      response.errors.error = batchMessage.BATCH_NOT_FOUND;
      response.message = batchMessage.BATCH_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = batchMessage.BATCH_UPDATED_SUCCESSFULLY;
    response.body = formData(batch);
    return response;
  } catch (error) {
    response.errors = error;
    response.message = error.message;
    return response;
  }
};

module.exports.findOne = async (serviceData) => {
  try {
    const batch = await Batch.findOne({
      _id: serviceData.id,
      admin: serviceData._id,
    });

    if (!batch) {
      response.errors.error = batchMessage.BATCH_NOT_FOUND;
      response.message = batchMessage.BATCH_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = batchMessage.BATCH_GET_SUCCESSFULLY;
    response.body = formData(batch);
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
  searchQuery,
  status = true,
  admin,
}) => {
  let conditions = {
    isDeleted: false,
    admin,
  };

  if (searchQuery) {
    const serchRegex = { $regex: searchQuery, $options: "i" };

    conditions.$or = [{ batchName: serchRegex }, { description: serchRegex }];
  }

  if (status == "All") {
    delete conditions.status;
  } else {
    conditions.status = status == "false" ? false : true;
  }

  try {
    const totalRecords = await Batch.countDocuments(conditions);

    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const batch = await Batch.find(conditions)
      .sort({ _id: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    if (!batch) {
      response.message = batchMessage.BATCH_NOT_FOUND;
      response.errors.error = batchMessage.BATCH_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = batchMessage.ALL_BATCH_GET_SUCCESSFULLY;
    response.body = formData(batch);
    response.page = page;
    response.totalPages = totalPages;
    response.totalRecords = totalRecords;
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
    const batch = await Batch.findByIdAndUpdate(
      {
        _id: serviceData.id,
        admin: serviceData._id,
      },
      {
        isDeleted: true,
      }
    );

    if (!batch) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { id: commanMessage.INVALID_ID };
      return response;
    }

    response.status = 200;
    response.message = batchMessage.BATCH_DELETED;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};
