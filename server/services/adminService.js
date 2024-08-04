const Admin = require("../models/adminModel");
const serverResponse = require("../constants/serverResponse");
const lodash = require("lodash");
const { adminMessage, commanMessage } = require("../constants/message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { formData } = require("../utils/mongooseUtills");
const { sendMail } = require("../utils/sendEmail");

module.exports.registerAdmin = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    // Check if the admin already exists
    const admin = await Admin.findOne({ email: serviceData.email });

    if (admin) {
      response.status = 400;
      response.message = commanMessage.EMAIL_ALREADY_EXIST;
      response.errors = { email: commanMessage.EMAIL_ALREADY_EXIST };
      return response;
    }

    // Hash the password
    serviceData.password = await bcrypt.hash(serviceData.password, 10);

    // Create and save the new admin
    const adminUser = await Admin.create(serviceData);

    const otp = Math.floor(Math.random() * (10000 - 1001)) + 1001;

    adminUser.otp = otp.toString();
    adminUser.otpExpiredAt = Date.now() + 5 * 60 * 1000;

    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    await adminUser.save();

    const emailOpt = sendMail(adminUser.email, otp);

    if (!emailOpt) {
      response.errors = { otp: adminMessage.OTP_RESEND };
      response.message = adminMessage.OTP_RESEND;
      return response;
    }

    response.status = 200;
    response.message = adminMessage.ADMIN_CREATED;
    response.body = null;
    response.token = token;
    return response;
  } catch (error) {
    response.message = commanMessage.SOMETHING_WENT_WRONG;
    response.errors = error;
    return response;
  }
};

module.exports.resendOtp = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const admin = await Admin.findOne({
      _id: serviceData._id,
      otpVerified: false,
    });

    if (!admin) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { error: commanMessage.INVALID_ID };
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    const otp = Math.floor(Math.random() * (10000 - 1001));

    admin.otp = otp.toString();
    admin.otpExpiredAt = Date.now() + 5 * 60 * 1000;

    await admin.save();

    const emailOpt = sendMail(admin.email, otp);

    if (!emailOpt) {
      response.errors = { otp: adminMessage.OTP_RESEND };
      response.message = adminMessage.OTP_RESEND;
      return response;
    }

    response.status = 200;
    response.token = token;
    response.message = commanMessage.OTP_SEND_SUCCESSFULLY;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.verifyRegisterOtp = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const admin = await Admin.findOne({
      _id: serviceData.admin._id,
      otp: serviceData.otp,
      otpExpiredAt: { $gt: Date.now() },
      otpVerified: false,
    });
    if (!admin) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { error: commanMessage.INVALID_ID };
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    admin.otpVerified = true;

    await admin.save();

    response.status = 200;
    response.message = commanMessage.REGISTER_OTP_VERIFY;
    response.body = formData(admin);
    response.token = token;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.loginAdmin = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const admin = await Admin.findOne({ email: serviceData.email });

    if (!admin) {
      response.status = 400;
      response.message = adminMessage.EMAIL_AND_PASSWORD_NOT_MATCH;
      response.errors = {
        email: commanMessage.EMAIL_NOT_MATCHED,
        password: commanMessage.PASSWORD_NOT_MATCHED,
      };
      return response;
    }

    const isPasswordValid = await bcrypt.compare(
      serviceData.password,
      admin.password
    );

    if (!isPasswordValid) {
      response.message = commanMessage.PASSWORD_NOT_MATCHED;
      response.errors = { password: commanMessage.PASSWORD_NOT_MATCHED };
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    response.status = 200;
    response.message = commanMessage.ADMIN_LOGIN_SUCCESS;
    response.body = formData(admin);
    response.token = token;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.updateAdmin = async function (serviceData, updateData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    // update admin details
    const admin = await Admin.findByIdAndUpdate(
      { _id: serviceData.id, admin: serviceData.admin },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!admin) {
      response.status = 400;
      response.errors.error = adminMessage.ADMIN_NOT_FOUND;
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    const updateAdmin = await admin.save();

    if (updateAdmin) {
      response.status = 200;
      response.message = adminMessage.ADMIN_UPDATED;
      response.body = { ...formData(updateAdmin), token };
      return response;
    } else {
      response.status = 400;
      response.errors.error = adminMessage.ADMIN_NOT_UPDATED;
      response.message = adminMessage.ADMIN_NOT_UPDATED;
      return response;
    }
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.forgotPassword = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const admin = await Admin.findOne({ email: serviceData.email });

    if (!admin) {
      response.errors = { email: commanMessage.EMAIL_NOT_MATCHED };
      response.message = commanMessage.EMAIL_NOT_MATCHED;
      return response;
    }

    const otp = Math.floor(Math.random() * (10000 - 1000));

    admin.otp = otp.toString();
    admin.otpExpiredAt = Date.now() + 15 * 60 * 1000;

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    await admin.save();
    const emailOpt = sendMail(admin.email, otp);

    if (!emailOpt) {
      response.errors = { otp: adminMessage.OTP_RESEND };
      response.message = adminMessage.OTP_RESEND;
      return response;
    }

    response.status = 200;
    response.message = adminMessage.OTP_SEND_SUCCESSFULLY;
    response.body = { ...formData(admin), token };
    return response;
  } catch (error) {
    response.errors.error = error.message;
    return response;
  }
};

module.exports.verifyForgotPasswordOtp = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const admin = await Admin.findOne({
      _id: serviceData.admin._id,
      otp: serviceData.otp,
      otpExpiredAt: { $gt: Date.now() },
    });

    if (!admin) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { error: commanMessage.INVALID_ID };
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    await admin.save();

    response.status = 200;
    response.message = commanMessage.VERIFY_OTP;
    response.body = { ...formData(admin), token };
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.updatePassword = async function (serviceData) {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const admin = await Admin.findById(serviceData.admin._id);

    if (!admin) {
      response.message = commanMessage.INVALID_ID;
      return response;
    }

    const hashedpassword = await bcrypt.hash(serviceData.password, 10);

    admin.password = hashedpassword;
    const updateData = await admin.save();
    if (!updateData) {
      response.message = commanMessage.PASSWORD_NOT_UPDATED;
      response.errors.error = commanMessage.PASSWORD_NOT_UPDATED;
      return response;
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    response.status = 200;
    response.message = commanMessage.PASSWORD_UPDATED;
    response.body = { ...formData(updateData), token };
    return response;
  } catch (error) {
    response.errors.error = error.message;
    response.message = error.message;
    return response;
  }
};
