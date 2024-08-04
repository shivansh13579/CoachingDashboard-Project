const Joi = require("joi");
const { validateObjectId } = require("../utils/mongooseUtills");

module.exports.create = Joi.object({
  batchName: Joi.string().required().label("Batch Name"),
  description: Joi.string().allow("").label("Description"),
  batchStartDate: Joi.date().label("Batch Start Date"),
  batchEndingDate: Joi.date().label("Batch Ending Date"),
  batchStartTime: Joi.string().label("Batch Start Time"),
  batchEndingTime: Joi.string().label("Batch Ending Time"),
  studentLimit: Joi.number().label("Student Limit"),
  batchFee: Joi.number().required().label("Batch Fee"),
});

module.exports.update = Joi.object({
  batchName: Joi.string().label("Batch Name"),
  description: Joi.string().allow("").label("Description"),
  batchStartDate: Joi.string().label("Batch Start Date"),
  batchEndingDate: Joi.string().label("Batch Ending Date"),
  batchStartTime: Joi.string().label("Batch Start Time"),
  batchEndingTime: Joi.string().label("Batch Ending Time"),
  studentLimit: Joi.number().label("Student Limit"),
  batchFee: Joi.number().label("Batch Fee"),
});

module.exports.findAll = Joi.object({
  limit: Joi.number().allow("").label("Limit"),
  page: Joi.number().allow("").label("Page"),
  status: Joi.string().allow("").label("Status"),
  searchQuery: Joi.string().allow("").label("searchQuery"),
});

module.exports.batchId = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      return validateObjectId(value, helpers, "Batch");
    })
    .required(),
});
