const Router = require("express");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middleware/adminAuthentication");
const adminValidationSchema = require("../apiValidationSchemas/adminValidationSchemas");
const joiSchemaValidation = require("../middleware/joiSchemaValidation");
const adminRouter = Router();

// register
adminRouter.post(
  "/register",
  joiSchemaValidation.validateBody(adminValidationSchema.registerAdminSchema),
  adminController.registerAdmin
);

// Resend Otp
adminRouter.post(
  "/resendOtp",
  adminAuthentication,
  joiSchemaValidation.validateBody(adminValidationSchema.resendOtp),
  adminController.resendOtp
);

//verifyRegisterOtp
adminRouter.post(
  "/verifyRegisterOtp",
  adminAuthentication,
  joiSchemaValidation.validateBody(adminValidationSchema.verifyRegisterOtp),
  adminController.verifyRegisterOtp
);

// login
adminRouter.post(
  "/login",
  joiSchemaValidation.validateBody(adminValidationSchema.loginAdminSchema),
  adminController.loginAdmin
);

// update
adminRouter.put(
  "/update/:id",
  joiSchemaValidation.validateParams(adminValidationSchema.adminId),
  adminAuthentication,
  joiSchemaValidation.validateBody(adminValidationSchema.updateAdminSchema),
  adminController.updateAdmin
);

// forgotPassword
adminRouter.post(
  "/forgotPassword",
  joiSchemaValidation.validateBody(adminValidationSchema.forgotPasswordSchema),
  adminController.forgotPassword
);

// verifyForgotPasswordOtp
adminRouter.post(
  "/verifyForgotPasswordOtp",
  adminAuthentication,
  joiSchemaValidation.validateBody(
    adminValidationSchema.verifyForgotPasswordOtp
  ),
  adminController.verifyForgotPasswordOtp
);

// updatePassword
adminRouter.put(
  "/updatePassword",
  adminAuthentication,
  joiSchemaValidation.validateBody(adminValidationSchema.updatePassword),
  adminController.updatePassword
);

module.exports = adminRouter;
