import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Nav/Navbar";
import Footer from "./Footer";
import ProjectTree from "./ProjectTree";
import Dema from "./DEMA.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ProjectPage = () => {
  const { username, projectname } = useParams();
  const navigate = useNavigate();

  const projectSlug = projectname
    ? projectname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : null;

  const storedFullName = localStorage.getItem("fullName")?.trim();
  const evaluatorName = storedFullName || username || "defaultUser";

  const [scale, setScale] = useState(1);

  const handleNav = (action) => {
    if (action === "projects") {
      navigate("/home");
    } else if (action === "validation") {
      navigate(`/user/${evaluatorName}/project/${projectname}/validation`);
    } else if (action === "exit") {
      navigate("/");
    } else {
      console.log(`Navigate to ${action}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* Main Content Wrapper */}
      <div className="flex-grow p-4">
        {/* Top Navigation Section */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md p-3 rounded mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-900">
              LSP Rec Project with DEMA
            </span>
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
        </div>

        {/* Project and Evaluator Information */}
        <div className="mb-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <strong>User:</strong> {evaluatorName}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <strong>Project:</strong> {projectname?.toUpperCase() || "N/A"}
          </p>
        </div>

        {/* Modified Main Content Area */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-4"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          {/* Project Tree Container */}
          <div
            className="relative bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4"
            style={{
              minHeight: "calc(100vh - 200px)",
              backgroundImage:
                "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
              backgroundSize: "20px 20px", // Adjust the grid size as needed
            }}
          >
            <div className="absolute inset-2 flex items-center justify-center">
              <TransformWrapper
                initialScale={scale} // Use scale state for initial scale
                centerOnInit={true}
                wheel={{ step: 0.2 }} // Increase step value to make zooming faster
                doubleClick={{ disabled: true }}
                limitToBounds={false}
                preservePosition={true}
                minScale={0.25} // Optional: Set a minimum scale to prevent excessive zooming out
                maxScale={1} // Optional: Set a maximum scale to prevent excessive zooming in
                onScaleChange={({ scale }) => setScale(scale)} // Update scale when zooming
              >
                {({ resetTransform }) => (
                  <>
                    <TransformComponent
                      wrapperStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <ProjectTree
                          projectId={projectSlug}
                          username={evaluatorName}
                          projectname={projectname}
                        />
                      </div>
                    </TransformComponent>

                    <button
                      className="absolute bottom-4 right-4 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 z-50"
                      onClick={() => resetTransform()}
                    >
                      Reset View
                    </button>
                  </>
                )}
              </TransformWrapper>
            </div>
          </div>

          {/* Chat Assistant Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px] overflow-hidden">
            <Dema />
          </div>
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ProjectPage;
