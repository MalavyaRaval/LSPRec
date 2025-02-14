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
          id: Date.now(),
          name: "Root",
          children: [],
          parent: null,
          attributes: {
            importance: null,
            connection: null,
            created: new Date()
          }
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
    
    const projectId = projectName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
      
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
        parent: null,
        attributes: {
          importance: null,
          connection: null,
          created: new Date()
        }
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

// POST: Add child nodes with DEMA metadata
router.post('/:projectId/nodes', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { parentId, children, metadata } = req.body;
    
    const addChildrenToParent = (node) => {
      if (node.id == parentId) { // Loose equality for type flexibility
        // Add DEMA metadata to parent node
        node.attributes = node.attributes || {};
        node.attributes.decisionProcess = metadata?.decisionProcess || 'DEMA';
        node.attributes.objectName = metadata?.objectName || 'Untitled Object';
        node.attributes.lastUpdated = new Date();

        // Add children with attributes (read from child.attributes)
        node.children.push(...children.map(child => ({
          ...child,
          attributes: {
            importance: Number(child.attributes?.importance),
            connection: Number(child.attributes?.connection),
            created: new Date(child.attributes?.created || Date.now())
          },
          parent: node.id,
          children: []
        })));

        return true;
      }
      return node.children?.some(addChildrenToParent);
    };

    if (!addChildrenToParent(project.treeData)) {
      return res.status(404).json({ message: 'Parent node not found' });
    }

    project.markModified('treeData');
    await project.save();
    res.json(project.treeData);
  } catch (err) {
    res.status(500).json({ 
      message: err.message,
      errorDetails: {
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        receivedData: req.body
      }
    });
  }
});

// Export the router only once
module.exports = router;
