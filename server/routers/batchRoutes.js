const Router = require("express");
const batchValidationSchemas = require("../apiValidationSchemas/batchValidationSchemas");
const adminAuthentication = require("../middleware/adminAuthentication");
const batchController = require("../controllers/batchController");
const joiSchemaValidation = require("../middleware/joiSchemaValidation");
const batchRouter = Router();

batchRouter.post(
  "/",
  adminAuthentication,
  joiSchemaValidation.validateBody(batchValidationSchemas.create),
  batchController.create
);

batchRouter.put(
  "/:id",
  joiSchemaValidation.validateParams(batchValidationSchemas.batchId),
  adminAuthentication,
  joiSchemaValidation.validateBody(batchValidationSchemas.update),
  batchController.update
);

batchRouter.get(
  "/:id",
  joiSchemaValidation.validateParams(batchValidationSchemas.batchId),
  adminAuthentication,
  batchController.findOne
);

batchRouter.get(
  "/",
  joiSchemaValidation.validateQuery(batchValidationSchemas.findAll),
  adminAuthentication,
  batchController.findAll
);

batchRouter.delete(
  "/:id",
  joiSchemaValidation.validateParams(batchValidationSchemas.batchId),
  adminAuthentication,
  batchController.delete
);

module.exports = batchRouter;
