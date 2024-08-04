const mongoose = require("mongoose");

const studentFeesSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      require: true,
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "student",
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

module.exports = mongoose.model("studentFees", studentFeesSchema);
