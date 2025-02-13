const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET: Retrieve the project tree by projectId (create it if not exists)
router.get('/:projectId', async (req, res) => {
  try {
    let project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      project = new Project({
        projectId: req.params.projectId,
        treeData: {
          id: Date.now(), // Unique root node id
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

// PUT: Update the project tree
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

// POST: Create a new project
router.post('/', async (req, res) => {
  try {
    const { projectName } = req.body;
    if (!projectName || typeof projectName !== 'string') {
      return res.status(400).json({ message: "Valid projectName is required" });
    }
    // Create URL-safe projectId
    const projectId = projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    // Check if project already exists
    const exists = await Project.findOne({ projectId });
    if (exists) {
      return res.status(400).json({ message: "Project name already exists" });
    }
    const newProject = new Project({
      projectId,
      treeData: {
        id: Date.now(),
        name: projectName,
        children: [],
        parent: null
      }
    });
    await newProject.save();
    res.status(201).json({
      projectId,
      projectName,
      _id: newProject._id
    });
  } catch (err) {
    res.status(400).json({ 
      message: err.message || "Error creating project",
      errorDetails: err 
    });
  }
});

module.exports = router;

// POST: Add child nodes to a project tree
router.post('/:projectId/nodes', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { parentId, children } = req.body;
    
    const addChildrenToParent = (node) => {
      if (node.id === parentId) {
        node.children.push(...children);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (addChildrenToParent(child)) return true;
        }
      }
      return false;
    };

    if (!addChildrenToParent(project.treeData)) {
      return res.status(404).json({ message: 'Parent node not found' });
    }

    project.markModified('treeData');
    await project.save();
    res.json(project.treeData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});