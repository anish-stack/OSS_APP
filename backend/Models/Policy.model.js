const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema(
  {
    typeOfPolicy: {
      type: String,
      required: true,
      trim: true,
    },
    Heading: {
      type: String,
      required: true,
      trim: true,
    },
    WrittienBy: {
      type: String,
      required: true,
      trim: true,
    },
    HtmlContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PolicySchema.index({ typeOfPolicy: 1, Heading: 1 });

const Policy = mongoose.model('Policy', PolicySchema);

module.exports = Policy;
