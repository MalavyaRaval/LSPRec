import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

const ProjectPage = () => {
  const { username, projectname } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try to fetch project details from the backend
    axiosInstance
      .get(`/get-project/${username}/${projectname}`)
      .then((response) => {
        // Assume the API returns { project: { ... } } if it exists
        setProject(response.data.project);
        setLoading(false);
      })
      .catch((err) => {
        // If the error status is 404, assume it's a new project with no details yet.
        if (err.response && err.response.status === 404) {
          setProject(null);
          setError(""); // Clear error so that we render the default page
        } else {
          setError(
            "Error fetching project details: " +
              (err.response?.data?.message || err.message)
          );
        }
        setLoading(false);
      });
  }, [username, projectname]);

  if (loading) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="project-page p-4">
      <h1 className="text-2xl font-bold">
        {project ? project.name : projectname}
      </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {!project ? (
        <div>
          <p>No project details found. Start building your project!</p>
          {/* Here you can add a form or any default content to let the user edit/add details */}
        </div>
      ) : (
        <div>
          <p>{project.description}</p>
          {/* Render additional project details if needed */}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
