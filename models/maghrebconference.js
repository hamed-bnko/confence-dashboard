const mongoose = require("mongoose");

const confSchema = new mongoose.Schema(
  {
    paper: { type: String, trim: true },
    paperAfterEdit: { type: String, trim: true },
    researchName: { type: String, trim: true, required: true },
    abstruct: { type: String, trim: true, required: true },
    theHub: { type: String, trim: true, required: true },
    // الباحثين
    author: { type: String, trim: true, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    country: { type: String, trim: true, required: true }, //الدولة
    Organization: { type: String, trim: true, required: true }, //الجهة التابع لها
    Qualification: { type: String, trim: true, required: true }, //المؤهل العلمي
    Degree: { type: String, trim: true, required: true }, //الدرجة العلمية

    author1: { type: String, trim: true },
    email1: { type: String, trim: true },

    author2: { type: String, trim: true },
    email2: { type: String, trim: true },

    // CV: { type: String, trim: true },
    TypeOfParticipation: { type: String, trim: true }, //نوع المشاركة
    Reviewer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: String,
    },
    Reviewer2: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: String,
    },
    status: { type: Number, default: 0 },
    status2: { type: Number, default: 0 },
    finalResualt: { type: Number, default: 0 },
    Rejected: Boolean,
    statusChange: { type: String, trim: true },
    Notes: Array,
    Notes2: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("maghrebconference", confSchema);
