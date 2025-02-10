import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/projecttree.css";

const TreeNode = ({ node, addChild, deleteNode, editNode }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [childName, setChildName] = useState("");
  const [editing, setEditing] = useState(false);
  const [showAddChildInput, setShowAddChildInput] = useState(false);

  // Use ref to track the options box
  const optionsRef = useRef(null);

  // Close options if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddChild = () => {
    if (childName.trim()) {
      addChild(node.id, childName.trim());
      setChildName("");
      setShowAddChildInput(false);
    }
  };

  const handleOptionClick = (action) => {
    setShowOptions(false);
    action();
  };

  return (
    <div className="tree-branch">
      {node.parent && (
  <div className="connector">
    <svg viewBox="0 0 80 30" preserveAspectRatio="none">
      <path d="M40,30 C40,15 40,15 40,0" />
    </svg>
  </div>
)}
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
        <div ref={optionsRef} className="node-options flex space-x-2 mt-2">
          <button
            className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => handleOptionClick(() => deleteNode(node.id))}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={() => handleOptionClick(() => setEditing(true))}
          >
            Edit
          </button>
          <button
            className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={() => handleOptionClick(() => {
              setShowAddChildInput(true);
              setChildName("");
            })}
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
      <div key={child.id} className="child-wrapper">
        <div className="child-connector">
          <svg viewBox="0 0 80 30" preserveAspectRatio="none">
            {/* This path creates a smooth curve from left to right */}
            <path d="M0,30 C40,0 40,0 80,30" />
          </svg>
        </div>
        <TreeNode
          node={child}
          addChild={addChild}
          deleteNode={deleteNode}
          editNode={editNode}
        />
      </div>
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
        // Add the new node as a sibling
        return { ...node, children: [...node.children, newNode] };
      }

      // Ensure children can't exceed 5 children
      if (node.children && node.children.length > 0) {
        node.children = node.children.map(updateTree);
      }

      return node;
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
