import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TreeNode = ({
  node,
  addChild,
  deleteNode,
  editNode,
  projectId,
  username,
  projectname,
  level = 0,
}) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [childName, setChildName] = useState("");
  const [editing, setEditing] = useState(false);
  const [showAddChildInput, setShowAddChildInput] = useState(false);
  const optionsRef = useRef(null);
  const nodeRef = useRef(null);

  const colors = [
    "bg-blue-100 border-blue-300",
    "bg-green-100 border-green-300",
    "bg-purple-100 border-purple-300",
    "bg-yellow-100 border-yellow-300",
    "bg-pink-100 border-pink-300",
  ];

  const currentColor = colors[level % colors.length];

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
    if (projectId && username && projectname) {
      navigate(
        `/dema?projectId=${projectId}&parentId=${node.id}&username=${username}&projectname=${projectname}`
      );
    }
  };

  return (
    <div className={`relative my-8`} style={{ marginLeft: `${level * 80}px` }}>
      {node.parent && (
        <div className="absolute top-[-24px] left-[-48px] h-[calc(100%+24px)] w-12 border-l-2 border-b-2 border-gray-300 rounded-bl-lg" />
      )}

      {/* Node Content Container */}
      <div className="relative" ref={nodeRef}>
        <div
          className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group border-2 mb-4 ${currentColor}`}
          onClick={() => setShowOptions(!showOptions)}
        >
          {editing ? (
            <input
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={node.name}
              onChange={(e) => editNode(node.id, e.target.value)}
              onBlur={() => setEditing(false)}
              autoFocus
            />
          ) : (
            <div className="space-y-2">
              <span className="block text-lg font-medium text-gray-800">
                {node.name}
              </span>
              {node.attributes && (
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                    <span className="text-gray-600 mr-1">⚖️</span>
                    {node.attributes.importance}
                  </div>
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                    <span className="text-gray-600 mr-1">🔗</span>
                    {node.attributes.connection}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(node.attributes.created).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Options Menu */}
        {showOptions && (
          <div
            ref={optionsRef}
            className="absolute left-full ml-4 top-0 flex flex-col gap-2 z-10"
          >
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              onClick={() => handleOptionClick(() => deleteNode(node.id))}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              onClick={() => handleOptionClick(() => setEditing(true))}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
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

        {/* Add Child Input */}
        {showAddChildInput && (
          <div className="absolute left-full ml-4 top-0 flex items-center bg-white p-2 rounded shadow-lg z-10">
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Child name"
              className="px-2 py-1 border rounded mr-2"
              onKeyPress={(e) => e.key === "Enter" && handleAddChild()}
            />
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              onClick={handleAddChild}
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Children Container */}
      {node.children && node.children.length > 0 && (
        <div className="ml-16 mt-8 space-y-8">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              addChild={addChild}
              deleteNode={deleteNode}
              editNode={editNode}
              projectId={projectId}
              username={username}
              projectname={projectname}
            />
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
    const removeNode = (node) => ({
      ...node,
      children: node.children
        .filter((child) => child.id !== nodeId)
        .map(removeNode),
    });
    const updatedTree = removeNode(tree);
    setTree(updatedTree);
    await saveProject(updatedTree);
  };

  const editNode = async (nodeId, newName) => {
    const updateName = (node) =>
      node.id === nodeId
        ? { ...node, name: newName }
        : { ...node, children: node.children.map(updateName) };
    const updatedTree = updateName(tree);
    setTree(updatedTree);
    await saveProject(updatedTree);
  };

  if (loading) return <div className="text-center p-4">Loading project...</div>;
  if (!tree) return <div className="text-center p-4">Project not found</div>;

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
