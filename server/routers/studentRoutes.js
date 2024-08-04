const Router = require("express");
const joiSchemaValidation = require("../middleware/joiSchemaValidation");
const studentController = require("../controllers/studentController");
const studentValidationSchema = require("../apiValidationSchemas/studentValidationSchemas");
const adminAuthentication = require("../middleware/adminAuthentication");
const studentRouter = Router();

studentRouter.post(
  "/",
  adminAuthentication,
  joiSchemaValidation.validateBody(studentValidationSchema.create),
  studentController.create
);

studentRouter.put(
  "/:id",
  joiSchemaValidation.validateParams(studentValidationSchema.studentId),
  adminAuthentication,
  joiSchemaValidation.validateBody(studentValidationSchema.update),
  studentController.update
);

studentRouter.get(
  "/:id",
  joiSchemaValidation.validateParams(studentValidationSchema.studentId),
  adminAuthentication,
  studentController.findOne
);

studentRouter.get(
  "/",
  joiSchemaValidation.validateQuery(studentValidationSchema.findAll),
  adminAuthentication,
  studentController.findAll
);

studentRouter.delete(
  "/:id",
  joiSchemaValidation.validateParams(studentValidationSchema.studentId),
  adminAuthentication,
  studentController.delete
);

module.exports = studentRouter;
