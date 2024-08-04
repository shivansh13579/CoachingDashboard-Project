const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      require: true,
    },
    studentLimit: {
      type: Number,
      require: true,
    },
    batchStartDate: {
      type: Date,
      require: true,
    },
    batchEndingDate: {
      type: Date,
      require: true,
    },
    batchStartTime: {
      type: String,
      require: true,
    },
    batchEndingTime: {
      type: String,
      require: true,
    },
    batchFee: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model("batch", batchSchema);
