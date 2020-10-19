const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  rolls: { type: Number, default: 0 },
  password: { type: String, required: true, trim: true },
  theHub: { type: String, trim: true }, //المحور
  Agreement: Boolean,
  files:Array,
  numberOfResearchs : {type : Number ,default : 0}
});
module.exports = mongoose.model("user", userSchema);
