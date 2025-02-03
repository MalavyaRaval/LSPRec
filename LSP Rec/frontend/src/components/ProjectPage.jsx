import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { username, projectname } = useParams();

  return (
    <div>
      <h1>Project Page</h1>
      <p>Username: {username}</p>
      <p>Project Name: {projectname}</p>
      {/* Add more content for the project page here */}
    </div>
  );
};

export default ProjectPage;