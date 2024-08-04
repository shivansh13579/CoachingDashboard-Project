const Joi = require("joi");
const { validateObjectId } = require("../utils/mongooseUtills");

module.exports.create = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  mobile: Joi.number().label("Mobile"),
  parentMobile: Joi.number().label("Parent Mobile"),
  fatherName: Joi.string().label("Father Name"),
  batch: Joi.string().required().label("Batch"),
});

module.exports.update = Joi.object({
  firstName: Joi.string().label("First Name"),
  lastName: Joi.string().label("Last Name"),
  mobile: Joi.number().label("Mobile"),
  parentMobile: Joi.number().label("Parent Mobile"),
  fatherName: Joi.string().label("Father Name"),
  batch: Joi.string().label("Batch"),
});

module.exports.findAll = Joi.object({
  limit: Joi.number().label("Limit"),
  page: Joi.number().label("Page"),
  status: Joi.string().label("Status"),
  searchQuery: Joi.string().allow("").label("searchQuery"),
  batch: Joi.string().label("Batch"),
  student: Joi.string().label("Student"),
});

module.exports.studentId = Joi.object({
  id: Joi.string()
    .custom((value, helpers) => {
      return validateObjectId(value, helpers, "Student");
    })
    .required(),
});
