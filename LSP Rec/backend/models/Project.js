const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  treeData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});
module.exports = mongoose.model('Project', projectSchema);