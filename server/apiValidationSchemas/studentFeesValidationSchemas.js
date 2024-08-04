const Joi = require("joi");
const { validateObjectId } = require("../utils/mongooseUtills");

module.exports.create = Joi.object({
  amount: Joi.number().required().label("Amount"),
  student: Joi.string().required().label("Student"),
  batch: Joi.string().required().label("Batch"),
});

module.exports.update = Joi.object({
  amount: Joi.number().label("Amount"),
  student: Joi.string().label("Student"),
  batch: Joi.string().label("Batch"),
});

module.exports.findAll = Joi.object({
  limit: Joi.string().allow("").label("Limit"),
  page: Joi.string().allow("").label("Page"),
  status: Joi.string().allow("").label("Status"),
  searchQuery: Joi.string().allow("").label("searchQuery"),
  student: Joi.string().label("Student"),
  batch: Joi.string().label("Batch"),
});

module.exports.findAllStudent = Joi.object({
  limit: Joi.string().allow("").label("Limit"),
  page: Joi.string().allow("").label("Page"),
  status: Joi.string().allow("").label("Status"),
  searchQuery: Joi.string().allow("").label("searchQuery"),
  student: Joi.string().label("Student"),
  batch: Joi.string().label("Batch"),
});

module.exports.allPaymentOfStudent = Joi.object({
  student: Joi.string().label("Student"),
});

module.exports.allStudent = Joi.object({
  student: Joi.string().label("Student"),
  batchFee: Joi.number().label("Batch Fee"),
});

module.exports.studentFeesId = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      return validateObjectId(value, helpers, "studentFees");
    })
    .required(),
});
