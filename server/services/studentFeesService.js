const serverResponse = require("../constants/serverResponse");
const { commanMessage, studentFeesMessage } = require("../constants/message");
const lodash = require("lodash");
const StudentFees = require("../models/studentFeesModel");
const { formData } = require("../utils/mongooseUtills");
const mongoose = require("mongoose");
const Batch = require("../models/batchModel");
const Student = require("../models/studentModel");

module.exports.create = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const studentFees = await StudentFees.create(serviceData);
    await studentFees.save();
    response.status = 200;
    response.message = studentFeesMessage.STUDENT_FEES_CREATED;
    response.body = formData(studentFees);
    return response;
  } catch (error) {
    response.message = commanMessage.SOMETHING_WENT_WRONG;
    response.errors = error;
    return response;
  }
};

module.exports.update = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const id = serviceData.id;
    delete serviceData.id;
    const studentFees = await StudentFees.findByIdAndUpdate(id, serviceData, {
      new: true,
    });

    if (!studentFees) {
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = studentFeesMessage.STUDENT_FEES_UPDATED_SUCCESSFULLY;
    response.body = formData(studentFees);
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
    const studentFees = await StudentFees.findOne({
      _id: serviceData.id,
    });

    if (!studentFees) {
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.message = studentFeesMessage.STUDENT_FEES_GET_SUCCESSFULLY;
    response.body = formData(studentFees);
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.findAllStudent = async ({
  limit = 10,
  page = 1,
  status = true,
  searchQuery,
  student,
  batch,
}) => {
  const response = lodash.cloneDeep(serverResponse);

  let conditions = {
    isDeleted: false,
  };

  if (student) {
    conditions.student = new mongoose.Types.ObjectId(student);
  }

  if (batch) {
    conditions.batch = new mongoose.Types.ObjectId(batch);
  }

  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: "i" };

    conditions.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { student: searchRegex },
      { batchName: searchRegex },
    ];
  }

  if (status == "All") {
    delete conditions.status;
  } else {
    conditions.status = status == "false" ? false : true;
  }

  try {
    // const totalRecordOfStudentFees = await StudentFees.aggregate([
    //   { $match: conditions },
    //   {
    //     $group: {
    //       _id: "$student",
    //     },
    //   },
    //   {
    //     $count: "count",
    //   },
    // ]);

    // const totalPageOfStudentFees = Math.ceil(
    //   totalRecordOfStudentFees[0].count / parseInt(limit)
    // );

    // const totalRecordsOfStudent = await Student.aggregate([
    //   {
    //     $match: conditions,
    //   },
    //   { $count: "count" },
    // ]);

    // const totalPageOfStudent = Math.ceil(
    //   totalRecordsOfStudent[0].count / parseInt(limit)
    // );

    const studentFees = await StudentFees.aggregate([
      { $match: conditions },
      {
        $group: {
          _id: "$student",
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "batches",
          localField: "student.batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      {
        $addFields: {
          student: { $arrayElemAt: ["$student", 0] },
          batch: { $arrayElemAt: ["$batch", 0] },
        },
      },
    ]);

    if (!studentFees) {
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }

    // all StudentWIth Payment

    const students = await Student.aggregate([
      {
        $match: conditions,
      },
      { $sort: { _id: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "batches",
          localField: "batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },
    ]);

    //Create Map method to set  all studentFees in Map.
    const studentFeeMap = new Map();

    studentFees.forEach((fee) => {
      studentFeeMap.set(fee._id.toString(), fee.amount);
    });

    const studentWithFees = students.map((student) => {
      const amount = studentFeeMap.get(student._id.toString());
      return {
        student,
        amount: amount || 0,
      };
    });

    // const totalRecordsOfStudent = studentWithFees.length;

    const studentFullPayment = await StudentFees.aggregate([
      { $match: conditions },
      {
        $lookup: {
          from: "batches",
          localField: "batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      { $match: { $expr: { $eq: ["$amount", "$batch.batchFee"] } } },
      { $sort: { _id: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);

    // const totalRecordsFullPayment = studentFullPayment.length;
    // const totalPageOfFullPayment = Math.ceil(
    //   totalRecordsFullPayment / parseInt(limit)
    // );

    const studentRemaningFees = await StudentFees.aggregate([
      { $match: conditions },
      {
        $group: {
          _id: "$student",
          amount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "batches",
          localField: "student.batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      { $unwind: "$batch" },

      { $match: { $expr: { $ne: ["$amount", "$batch.batchFee"] } } },
      { $sort: { _id: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);

    // const totalRecordOfremaningFees = studentRemaningFees.length;
    // const totalPageOfRemaningPayment = Math.ceil(
    //   totalRecordOfremaningFees / parseInt(limit)
    // );

    response.status = 200;
    response.message = studentFees.ALL_STUDENT_FEES_GET_SUCCESSFULLY;
    response.body = studentWithFees;
    // studentWithFees.studentFullPayment = studentFullPayment;
    // response.page = page;
    // response.totalRecordsOfStudent = totalRecordsOfStudent;
    // response.totalPageOfStudent = totalPageOfStudent;
    // response.totalRecordOfStudentFees = totalRecordOfStudentFees;
    // response.totalPageOfStudentFees = totalPageOfStudentFees;
    response.studentFullPayment = studentFullPayment;
    // response.totalRecordsFullPayment = totalRecordsFullPayment;
    // response.totalPageOfFullPayment = totalPageOfFullPayment;
    response.studentRemaningFees = studentRemaningFees;
    // response.totalRecordOfremaningFees = totalRecordOfremaningFees;
    // response.totalPageOfRemaningPayment = totalPageOfRemaningPayment;
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
  student,
  batch,
}) => {
  const response = lodash.cloneDeep(serverResponse);

  let conditions = {
    isDeleted: false,
  };

  if (student) {
    conditions.student = new mongoose.Types.ObjectId(student);
  }

  try {
    const studentFees = await StudentFees.aggregate([
      { $match: conditions },
      // {
      //   $group: {
      //     _id: "$student",
      //     amount: { $sum: "$amount" },
      //   },
      // },
      { $sort: { _id: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "batches",
          localField: "student.batch",
          foreignField: "_id",
          as: "batch",
        },
      },
      {
        $addFields: {
          student: { $arrayElemAt: ["$student", 0] },
          batch: { $arrayElemAt: ["$batch", 0] },
        },
      },
    ]);

    const sumOfFees = await StudentFees.aggregate([
      { $match: conditions },
      {
        $group: {
          _id: "$student",
          amount: { $sum: "$amount" },
        },
      },
    ]);
    console.log("sum", sumOfFees);

    if (!studentFees) {
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }

    response.body = studentFees;
    response.totalAmount = sumOfFees[0].amount;
    response.status = 200;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};

module.exports.allPaymentOfStudent = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);
  try {
    const studentPayment = await StudentFees.find({
      student: serviceData.student,
    });

    if (!studentPayment) {
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }

    response.status = 200;
    response.body = formData(studentPayment);
    response.message = studentFeesMessage.STUDENT_FEES_GET_SUCCESSFULLY;
    return response;
  } catch (error) {
    response.errors = error;
    response.message = error.message;
    return response;
  }
};

module.exports.allStudent = async ({
  limit = 10,
  page = 1,
  status = true,
  student,
  batch,
}) => {
  const response = lodash.cloneDeep(serverResponse);

  let conditions = {
    isDeleted: false,
  };
  if (batch) {
    conditions.batch = new mongoose.Types.ObjectId(batch);
  }

  if (student) {
    conditions.student = new mongoose.Types.ObjectId(student);
  }

  if (status == "All") {
    delete conditions.status;
  } else {
    conditions.status = status == "false" ? false : true;
  }

  try {
    // const students = await Student.find({ isDeleted: false });
    const studentsWithFee = await Student.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: "studentfees", // replace with your actual StudentFees collection name
          localField: "_id",
          foreignField: "student",
          as: "fees",
        },
      },
      {
        $unwind: {
          path: "$fees",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    console.log("student", studentsWithFee);
    return;

    // Get student fees based on conditions
    const studentFees = await StudentFees.aggregate([
      { $match: conditions },
      {
        $group: {
          _id: "$student",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    if (!studentFees) {
      response.message = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      response.errors.error = studentFeesMessage.STUDENT_FEES_NOT_FOUND;
      return response;
    }
    // Create a map to quickly find student fees by student ID
    const studentFeesMap = new Map();
    studentFees.forEach((fee) => {
      studentFeesMap.set(fee._id.toString(), fee.amount);
    });

    // Merge student data with their fees
    const studentsWithFees = students.map((student) => {
      const amount = studentFeesMap.get(student._id.toString());
      return {
        student,
        amount: amount || null,
      };
    });
    const totalStudents = studentsWithFees.length;
    const unpaidStudents = studentsWithFees.filter(
      (student) => student.amount === null
    ).length;
    const paidStudents = studentFees.filter(
      (student) => student.amount !== null
    ).length;

    response.status = 200;
    response.body = studentsWithFees;
    response.totalStudents = totalStudents;
    response.unpaidStudents = unpaidStudents;
    response.paidStudents = paidStudents;
    response.response.message =
      studentFeesMessage.ALL_STUDENT_FEES_GET_SUCCESSFULLY;
    return response;
  } catch (error) {
    response.errors = error;
    response.message = error.message;
    return response;
  }
};

module.exports.delete = async (serviceData) => {
  const response = lodash.cloneDeep(serverResponse);

  try {
    const studentFees = await StudentFees.findByIdAndUpdate(
      { _id: serviceData.id },
      {
        isDeleted: true,
      }
    );

    if (!studentFees) {
      response.message = commanMessage.INVALID_ID;
      response.errors = { id: commanMessage.INVALID_ID };
    }

    response.status = 200;
    response.message = studentFeesMessage.STUDENT_FEES_DELETED;
    return response;
  } catch (error) {
    response.message = error.message;
    response.errors = error;
    return response;
  }
};
