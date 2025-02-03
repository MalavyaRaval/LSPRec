import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance"; // Ensure to use your axios instance to fetch data

const ProjectPage = () => {
  const { username, projectName } = useParams(); // Get username and projectName from the URL
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Fetch project data from your backend or API
        const response = await axiosInstance.get(`/get-project/${username}/${projectName}`);
        if (response.data && response.data.project) {
          setProject(response.data.project);
        } else {
          setError("Project not found.");
        }
      } catch (error) {
        setError("Error fetching project details: " + error.message);
      }
    };

    fetchProjectDetails();
  }, [username, projectName]);

  return (
    <div className="project-page">
      {error && <div className="error-message">{error}</div>}
      {project ? (
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <img src={project.image || "/defaultImage.jpg"} alt="Project" />
          {/* Render more project details as needed */}
        </div>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
};

export default ProjectPage;
