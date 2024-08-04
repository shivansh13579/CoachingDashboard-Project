const Router = require("express");
const joiSchemaValidation = require("../middleware/joiSchemaValidation");
const studentFeesController = require("../controllers/studentFeesController");
const studentFeesValidationSchema = require("../apiValidationSchemas/studentFeesValidationSchemas");
const adminAuthentication = require("../middleware/adminAuthentication");
const studentFeesRouter = Router();

studentFeesRouter.post(
  "/",
  adminAuthentication,
  joiSchemaValidation.validateBody(studentFeesValidationSchema.create),
  studentFeesController.create
);

studentFeesRouter.put(
  "/:id",
  joiSchemaValidation.validateParams(studentFeesValidationSchema.studentFeesId),
  adminAuthentication,
  joiSchemaValidation.validateBody(studentFeesValidationSchema.update),
  studentFeesController.update
);

studentFeesRouter.get(
  "/allStudent",
  joiSchemaValidation.validateQuery(studentFeesValidationSchema.findAllStudent),
  adminAuthentication,
  studentFeesController.findAllStudent
);

studentFeesRouter.get(
  "/completePayment",
  joiSchemaValidation.validateQuery(studentFeesValidationSchema.allStudent),
  adminAuthentication,
  studentFeesController.allStudent
);

studentFeesRouter.get(
  "/payment",
  joiSchemaValidation.validateQuery(
    studentFeesValidationSchema.allPaymentOfStudent
  ),
  adminAuthentication,
  studentFeesController.allPaymentOfStudent
);

studentFeesRouter.get(
  "/:id",
  joiSchemaValidation.validateParams(studentFeesValidationSchema.studentFeesId),
  adminAuthentication,
  studentFeesController.findOne
);

studentFeesRouter.get(
  "/",
  joiSchemaValidation.validateQuery(studentFeesValidationSchema.findAll),
  adminAuthentication,
  studentFeesController.findAll
);

studentFeesRouter.delete(
  "/:id",
  joiSchemaValidation.validateParams(studentFeesValidationSchema.studentFeesId),
  adminAuthentication,
  studentFeesController.delete
);

module.exports = studentFeesRouter;
