const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  treeData: {
    type: Object,
    required: true,
    default: { id: 1, name: "Root", children: [], parent: null }
  }
});

module.exports = mongoose.model("Project", projectSchema);
