import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Nav/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../CSS/navbar.css";
import Footer from "./Footer";
import defaultImage from "../images/symbol.jpg";
import axiosInstance from "./utils/axiosInstance";
import ToastMessage from "./ToastMessage";


const Home = () => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
  };

  const handleStartProject = (project) => {
    // Use the project ID from the backend response
    const projectId = project._id; // Use MongoDB _id or your project slug
    const storedFullName = localStorage.getItem("fullName")?.trim();
    
    if (storedFullName && projectId) {
      const formattedFullName = storedFullName.replace(/\s+/g, "-").toLowerCase();
      navigate(`/user/${formattedFullName}/project/${projectId}`);
    } else {
      showToast("Full name or project ID is missing", "error");
    }
  };
  
  


  const handleImageChange = (e) => {
    setEventDetails({
      ...eventDetails,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create project first
      const projectResponse = await axiosInstance.post("/api/projects", {
        projectName: eventDetails.name.trim()
      });
  
      // Create event with FormData
      const formData = new FormData();
      formData.append("name", eventDetails.name);
      formData.append("description", eventDetails.description);
      formData.append("projectId", projectResponse.data.projectId); // Use projectId instead of _id
      
      if (eventDetails.image) {
        formData.append("image", eventDetails.image);
      }
  
      const eventResponse = await axiosInstance.post("/add-event", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      // Update state with the new event
      setEvents([...events, { 
        ...eventResponse.data.event,
        projectId: projectResponse.data.projectId
      }]);
      
      // Reset form
      setEventDetails({ name: "", description: "", image: null });
      showToast("Project added successfully!", "success");
      document.querySelector('[data-bs-dismiss="modal"]').click();
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Project creation failed";
      showToast(errorMessage, "error");
    }
  };
  

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this Project?")) {
      axiosInstance
        .delete(`/delete-event/${eventId}`)
        .then((response) => {
          if (response.data && !response.data.error) {
            showToast("Project deleted successfully!", "success");
            getAllEvents();
          } else {
            showToast("Failed to delete Project", "error");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            showToast(
              "You do not have permission to delete this Project",
              "error"
            );
          } else {
            showToast("Error deleting Project: " + error.message, "error");
          }
        });
    }
  };

  const showDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getAllEvents = async () => {
    try {
      const response = await axiosInstance.get("/get-all-events");
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error(
        "Error fetching Projects:",
        error.response || error.message || error
      );
      showToast("Error fetching Projects: " + error.message, "error");
    }
  };

  const [toast, setToast] = useState({
    isShow: false,
    message: "",
    type: "",
  });

  const showToast = (message, type) => {
    setToast({
      isShow: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({ ...toast, isShow: false });
    }, 3000);
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-primary create-event-button"
            data-bs-toggle="modal"
            data-bs-target="#createEventModal"
          >
            +
          </button>
        </div>

        <div
          className="modal fade"
          id="createEventModal"
          tabIndex="-1"
          aria-labelledby="createEventModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createEventModalLabel">
                  Create New Project
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
    {successMessage && (
      <div className="alert alert-success">{successMessage}</div>
    )}
    <form onSubmit={handleSubmit}>
      <div className="form-fields space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Project Name:</label>
          <input
            type="text"
            name="name"
            className="form-control mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={eventDetails.name}
            onChange={handleChange}
            required
            placeholder="Unique project name"
          />
        </div>

                    <div>
                      <label className="block font-medium text-gray-700">Description:</label>
                      <textarea
                        name="description"
                        className="form-control mt-1 p-2 border border-gray-300 rounded-md w-full"
                        value={eventDetails.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">Image:</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control mt-1 p-2 border border-gray-300 rounded-md w-full"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Submit
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="events-list mt-4">
          {events.map((event, index) => (
            <div key={index} className="event-box p-3 mb-3 border rounded">
              <div className="image-container">
              <img
                src={event.image ? event.image : defaultImage}
                alt="Event"
                className="img-fluid event-image"
              />

              </div>
              <h5 className="event-name">{event.name}</h5>
              <button
                onClick={() => showDetails(event)}
                className="btn btn-link"
              >
                Show Details
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
                <div className="livestream-container">
                <button
                onClick={() => handleStartProject(event)}
                className="btn btn-link livestream-icon"
              >
                Start Project
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedEvent && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Description: {selectedEvent.description}</p>
                <div className="image-container">
                  <img
                    src={
                      selectedEvent.image
                        ? typeof selectedEvent.image === "string"
                          ? selectedEvent.image
                          : URL.createObjectURL(selectedEvent.image)
                        : defaultImage
                    }
                    alt="Event"
                    className="img-fluid event-image"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastMessage
        isShow={toast.isShow}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
};

export default Home;