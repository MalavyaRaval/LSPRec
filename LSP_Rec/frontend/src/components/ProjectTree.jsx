import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/projecttree.css";

const TreeNode = ({
  node,
  addChild,
  deleteNode,
  editNode,
  projectId,
  username,
  projectname,
}) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [childName, setChildName] = useState("");
  const [editing, setEditing] = useState(false);
  const [showAddChildInput, setShowAddChildInput] = useState(false);
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

  const handleAddWithDEMA = () => {
    console.log("handleAddWithDEMA called with:", {
      projectId,
      username,
      projectname,
      parentId: node.id,
    });
    if (projectId && username && projectname) {
      navigate(
        `/dema?projectId=${projectId}&parentId=${node.id}&username=${username}&projectname=${projectname}`
      );
    } else {
      console.error("Missing required project information for DEMA");
    }
  };

  return (
    <div className="tree-branch">
      {node.parent && (
        <div className="connector">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M50,0 C50,20 50,20 50,40" />
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
            className="node-input"
          />
        ) : (
          <div>
            <span className="node-name">{node.name}</span>
            {node.attributes && (
              <div className="node-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Importance:</span>{" "}
                  {node.attributes.importance}
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Connection:</span>{" "}
                  {node.attributes.connection}
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Created:</span>{" "}
                  {new Date(node.attributes.created).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {showOptions && (
        <div ref={optionsRef} className="node-options flex space-x-2">
          <button
            className="btn-option bg-red-500 text-black px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => handleOptionClick(() => deleteNode(node.id))}
          >
            Delete
          </button>
          <button
            className="btn-option bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={() => handleOptionClick(() => setEditing(true))}
          >
            Edit
          </button>
          <button
            className="btn-option bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={() =>
              handleOptionClick(() => {
                setShowAddChildInput(true);
                setChildName("");
              })
            }
            disabled={node.children.length >= 5}
            title={
              node.children.length >= 5 ? "Maximum 5 children allowed" : ""
            }
          >
            Add Child
          </button>
          <button
            className="btn-option bg-purple-500 text-black px-3 py-1 rounded hover:bg-purple-600 transition"
            onClick={() => handleOptionClick(handleAddWithDEMA)}
            disabled={node.children.length >= 5}
            title={
              node.children.length >= 5 ? "Maximum 5 children allowed" : ""
            }
          >
            Add with DEMA
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
            className="child-input mr-2 px-2 py-1 border rounded"
            onKeyPress={(e) => e.key === "Enter" && handleAddChild()}
          />
          <button
            className="btn-option bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 transition"
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
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0,40 C50,0 50,0 100,40" />
                </svg>
              </div>
              <TreeNode
                node={child}
                addChild={addChild}
                deleteNode={deleteNode}
                editNode={editNode}
                projectId={projectId}
                username={username}
                projectname={projectname}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectTree = ({ projectId, username, projectname }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/projects/${projectId}`
        );
        setTree(response.data);
      } catch (error) {
        console.error("Error loading project:", error);
        alert("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  const saveProject = async (updatedTree) => {
    try {
      await axios.put(
        `http://localhost:8000/api/projects/${projectId}`,
        updatedTree
      );
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
      // You can optionally set default attributes here for direct adds:
      attributes: { importance: 0, connection: 0, created: Date.now() },
    };

    const updateTree = (node) => {
      if (node.id === parentId) {
        if (node.children.length >= 5) {
          alert("Maximum of 5 children allowed per node!");
          return node;
        }
        return { ...node, children: [...node.children, newNode] };
      }
      return { ...node, children: node.children.map(updateTree) };
    };

    const updatedTree = updateTree({ ...tree });
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
        projectId={projectId}
        username={username}
        projectname={projectname}
      />
    </div>
  );
};

export default ProjectTree;
