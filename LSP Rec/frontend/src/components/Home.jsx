import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "./Nav/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../CSS/navbar.css"; // Import the CSS file
import Footer from "./Footer";
import defaultImage from "../images/symbol.jpg"; // Import the default image
import axiosInstance from "./utils/axiosInstance";
import ToastMessage from "./ToastMessage"; // Import the ToastMessage component

const Home = () => {
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    date: "",
    time: "",
    sponsor: "",
    coSponsor: "",
    security: "",
    food: "",
    custodian: "",
    description: "",
    image: null, // Initialize as null
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Add state for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setEventDetails({
      ...eventDetails,
      image: e.target.files[0], // Set the selected image file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    if (eventDetails.date < currentDate) {
      showToast(
        "Event date cannot be in the past. Please select a future date.",
        "error"
      );
      return;
    }

    const conflictEvent = events.find(
      (event) =>
        event.date === eventDetails.date && event.time === eventDetails.time
    );
    if (conflictEvent) {
      showToast(
        `Event "${conflictEvent.name}" is already scheduled at this time. Please choose another time.`,
        "error"
      );
    } else {
      try {
        const formData = new FormData();
        Object.keys(eventDetails).forEach((key) => {
          formData.append(key, eventDetails[key]);
        });

        const response = await axiosInstance.post("/add-event", formData);

        if (response.data && response.data.event) {
          setEvents([...events, { ...response.data.event, isExpanded: false }]);
          setEventDetails({
            name: "",
            date: "",
            time: "",
            sponsor: "",
            coSponsor: "",
            security: "",
            food: "",
            custodian: "",
            description: "",
            image: null,
          });
          setError("");
          showToast("Project added successfully!", "success");
          document.querySelector('[data-bs-dismiss="modal"]').click();
        } else {
          showToast("Failed to add event", "error");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          showToast(error.response.data.message, "error");
        } else {
          showToast("Error adding Project: " + error.message, "error");
        }
      }
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
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
                {/*error && <div className="alert alert-danger">{error}</div>*/}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-fields">
                    <label>
                      Project Name:
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={eventDetails.name}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Date:
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={eventDetails.date}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Time:
                      <input
                        type="time"
                        name="time"
                        className="form-control"
                        value={eventDetails.time}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Goals:
                      <input
                        type="text"
                        name="sponsor"
                        className="form-control"
                        value={eventDetails.sponsor}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      Stakeholder:
                      <input
                        type="text"
                        name="coSponsor"
                        className="form-control"
                        value={eventDetails.coSponsor}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Comments:
                      <input
                        type="text"
                        name="security"
                        className="form-control"
                        value={eventDetails.security}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Users:
                      <input
                        type="text"
                        name="food"
                        className="form-control"
                        value={eventDetails.food}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Sharing:
                      <input
                        type="text"
                        name="custodian"
                        className="form-control"
                        value={eventDetails.custodian}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Description:
                      <textarea
                        name="description"
                        className="form-control"
                        value={eventDetails.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </label>
                    <label>
                      Image:
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
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
                  src={
                    event.image
                      ? typeof event.image === "string"
                        ? event.image
                        : URL.createObjectURL(event.image)
                      : defaultImage
                  }
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
                <Link to="/camera" className="btn btn-link livestream-icon">
                  Start Project
                </Link>
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
                <p>Date: {selectedEvent.date}</p>
                <p>Time: {selectedEvent.time}</p>
                <p>Sponsor: {selectedEvent.sponsor}</p>
                <p>Co-Sponsor: {selectedEvent.coSponsor}</p>
                <p>Security: {selectedEvent.security}</p>
                <p>Food: {selectedEvent.food}</p>
                <p>Custodian: {selectedEvent.custodian}</p>
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
