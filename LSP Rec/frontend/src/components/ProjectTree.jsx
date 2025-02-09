//// filepath: /c:/Users/malav/OneDrive - San Francisco State University/Desktop/895/LSPRec/LSP Rec/frontend/src/components/ProjectTree.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/projecttree.css";

const TreeNode = ({ node, addChild, deleteNode, editNode }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [childName, setChildName] = useState("");
  const [editing, setEditing] = useState(false);
  const [showAddChildInput, setShowAddChildInput] = useState(false);

  const handleAddChild = () => {
    if (childName.trim()) {
      addChild(node.id, childName.trim());
      setChildName("");
      setShowAddChildInput(false);
    }
  };

  return (
    <div className="tree-branch">
      {node.parent && <div className="connector"></div>}
      <div className="node" onClick={() => setShowOptions(!showOptions)}>
        {editing ? (
          <input
            type="text"
            value={node.name}
            onChange={(e) => editNode(node.id, e.target.value)}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          node.name
        )}
      </div>

      {showOptions && (
        <div className="node-options flex space-x-2 mt-2">
          <button
            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => deleteNode(node.id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={() => {
              setShowAddChildInput(true);
              setChildName("");
            }}
            disabled={node.children.length >= 5}
            title={
              node.children.length >= 5
                ? "Maximum 5 children allowed"
                : ""
            }
          >
            Add Child
          </button>
        </div>
      )}

      {showAddChildInput && (
        <div className="add-child-input mt-2">
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Child name"
            className="mr-2 px-2 py-1 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleAddChild()}
          />
          <button
            className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={handleAddChild}
          >
            Submit
          </button>
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div className="children-container">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              addChild={addChild}
              deleteNode={deleteNode}
              editNode={editNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectTree = ({ projectId }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load project on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/projects/${projectId}`  // Use projectId
        );
        setTree(response.data);
      } catch (error) {
        console.error('Error loading project:', error);
        alert('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Unified save function
  const saveProject = async (updatedTree) => {
    try {
      await axios.put(`http://localhost:8000/api/projects/${projectId}`, updatedTree);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save changes");
    }
  };

  const addChild = async (parentId, childName) => {
    const newNode = {
      id: Date.now(),
      name: childName,
      children: [],
      parent: parentId,
    };

    const updateTree = (node) => {
      if (node.id === parentId) {
        if (node.children.length >= 5) {
          alert("Maximum of 5 children allowed per node!");
          return node;
        }
        return { ...node, children: [...node.children, newNode] };
      }
      return {
        ...node,
        children: node.children.map(updateTree),
      };
    };

    const updatedTree = updateTree(tree);
    setTree(updatedTree);
    await saveProject(updatedTree);
  };

  const deleteNode = async (nodeId) => {
    const removeNode = (node) => {
      return {
        ...node,
        children: node.children
          .filter((child) => child.id !== nodeId)
          .map(removeNode),
      };
    };

    const updatedTree = removeNode(tree);
    setTree(updatedTree);
    await saveProject(updatedTree);
  };

  const editNode = async (nodeId, newName) => {
    const updateName = (node) => {
      if (node.id === nodeId) {
        return { ...node, name: newName };
      }
      return { ...node, children: node.children.map(updateName) };
    };

    const updatedTree = updateName(tree);
    setTree(updatedTree);
    await saveProject(updatedTree);
  };

  if (loading) {
    return <div className="text-center p-4">Loading project...</div>;
  }

  if (!tree) {
    return <div className="text-center p-4">Project not found</div>;
  }

  return (
    <div className="tree-container p-4">
      <TreeNode
        node={tree}
        addChild={addChild}
        deleteNode={deleteNode}
        editNode={editNode}
      />
    </div>
  );
};

export default ProjectTree;