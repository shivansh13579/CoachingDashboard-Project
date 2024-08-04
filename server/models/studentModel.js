const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    fatherName: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    parentMobile: {
      type: String,
      require: true,
    },
    batch: {
      type: mongoose.Types.ObjectId,
      ref: "batch",
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "admin",
    },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (ret, doc, option) => {
        delete doc.__v;
        doc.id = doc._id;
        delete doc.isDeleted;
        return doc;
      },
    },
  }
);

module.exports = mongoose.model("student", studentSchema);
