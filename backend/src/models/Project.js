const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    prompt: { type: String, required: true, trim: true, maxlength: 5000 },
    code: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
