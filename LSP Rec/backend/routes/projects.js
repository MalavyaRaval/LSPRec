const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get or create project
router.get('/:projectId', async (req, res) => {
  try {
    let project = await Project.findOne({ projectId: req.params.projectId });
    
    if (!project) {
      project = new Project({
        projectId: req.params.projectId,
        treeData: {
          id: 1,
          name: "Root",
          children: [],
          parent: null
        }
      });
      await project.save();
    }
    
    res.json(project.treeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project
router.put('/:projectId', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { projectId: req.params.projectId },
      { treeData: req.body },
      { new: true, upsert: true }
    );
    res.json(project.treeData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

// POST
router.post('/', async (req, res) => {
  try {
    const { projectName } = req.body;
    
    // Validate project name
    if (!projectName || typeof projectName !== 'string') {
      return res.status(400).json({ message: "Valid projectName is required" });
    }

    // Create URL-safe ID
    const projectId = projectName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    // Check for existing project
    const exists = await Project.findOne({ projectId });
    if (exists) {
      return res.status(400).json({ message: "Project name already exists" });
    }

    const newProject = new Project({
      projectId,
      treeData: {
        id: Date.now(),  // Changed from static 1 to unique ID
        name: projectName,
        children: [],
        parent: null
      }
    });

    await newProject.save();
    
    res.status(201).json({
      projectId,
      projectName,
      _id: newProject._id  // Return both identifiers
    });
    
  } catch (err) {
    res.status(400).json({ 
      message: err.message || "Error creating project",
      errorDetails: err 
    });
  }
});