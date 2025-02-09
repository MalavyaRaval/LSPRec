import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Nav/Navbar";
import Footer from "./Footer";
import ProjectTree from "./ProjectTree";
import "../CSS/projectpage.css";

const ProjectPage = () => {
  const { username, projectname } = useParams();
  const navigate = useNavigate();

  const projectSlug = projectname
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  // Ideally, evaluatorName comes from your backend or user context.
  const storedFullName = localStorage.getItem("fullName")?.trim();
  const evaluatorName = storedFullName;

  const handleNav = (action) => {
    if (action === "projects") {
      navigate("/home");
    } else if (action === "validation" || action === "exit") {
      navigate("/");
    } else {
      console.log(`Navigate to ${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navbar at the top */}
      <Navbar />

      {/* Top Navigation Section */}
      <div className="flex items-center justify-between bg-white shadow-md p-3 rounded mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">LSP Rec</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
            onClick={() => handleNav("projects")}
          >
            All Projects
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600"
            onClick={() => handleNav("validation")}
          >
            Validation
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600"
            onClick={() => handleNav("exit")}
          >
            Exit
          </button>
      </div>

      {/* Project and Evaluator Information */}
      <div className="mb-4">
        <p className="text-lg text-gray-700">
          <strong>User:</strong> {evaluatorName}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Project:</strong> {projectname.toUpperCase()}
        </p>
      </div>

        {/* Main Content (Interactive Tree / Editing Form) */}
        <div className="bg-white p-6 rounded shadow">
        <ProjectTree projectId={projectSlug} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectPage;
