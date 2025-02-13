// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import AboutUs from "./components/aboutus.jsx";
import Intro from "./components/Intro.jsx";
import MyProfile from "./components/MyProfile.jsx";
import ProjectPage from "./components/ProjectPage.jsx";
import Dema from "./components/DEMA.jsx"; // Adjust path as needed
import ProjectTree from "./components/ProjectTree.jsx"; // Your existing component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/project/:projectId" element={<ProjectTree />} />
        <Route path="/" element={<Intro />} />
        <Route
          path="/user/:username/project/:projectname"
          element={<ProjectPage />}
        />
        <Route path="/dema" element={<Dema />} />
      </Routes>
    </Router>
  );
};

export default App;
