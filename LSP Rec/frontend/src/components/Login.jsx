import axiosInstance from "./utils/axiosInstance";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import Navbar from "./Nav/Navbar";
import Footer from "./Footer";
import defaultImage from "../images/symbol.jpg";
import ToastMessage from "./ToastMessage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setError("");

    // Login API call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);

        // Ensure fullName is available in the response data
        if (response.data.fullName) {
          // Save fullName to localStorage
          localStorage.setItem("fullName", response.data.fullName);
          console.log("Full Name saved to LocalStorage:", response.data.fullName);
        } else {
          console.error("Full name not found in the response data.");
        }

        navigate("/home"); // Redirect to home or another page after successful login
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login error:", error); // Debugging line
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="content-wrap">
          <div className="form-container">
            <h2>Login Page</h2>
            {error && <p className="error">{error}</p>} {/* Display error message */}
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-12 mb-3">
                <label htmlFor="inputEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <p className="text-sm text-center mt-4">
                  Not Registered yet???{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary underline"
                  >
                    Create an Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
