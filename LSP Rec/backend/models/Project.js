const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  treeData: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Project', projectSchema);