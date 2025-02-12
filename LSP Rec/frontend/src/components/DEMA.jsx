import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "../CSS/DEMA.css";

const Dema = () => {
  // Conversation flow state
  const [step, setStep] = useState("intro");
  // Data states
  const [objectName, setObjectName] = useState("");
  const [componentCount, setComponentCount] = useState("");
  const [componentDetails, setComponentDetails] = useState([]);

  // For showing chat messages if desired
  const [messages, setMessages] = useState([]);

  // ----- Conversation Flow Texts -----
  const introMessage =
    "I am DEMA, your decision-making assistant. I can help you to systematically determine the suitability (value) of a single object or multiple alternatives, based on your needs and requirements. If you have multiple objects or alternatives, I can help you to compare them and select the best alternative.";

  // ----- Handlers for flow transitions -----
  const handleContinue = (answer) => {
    if (answer === "yes") {
      setStep("objectName");
    } else {
      setStep("exit");
    }
  };

  const handleObjectNameSubmit = () => {
    if (objectName.trim()) {
      setStep("componentCount");
    }
  };

  const handleComponentCountSubmit = () => {
    const count = parseInt(componentCount);
    if (isNaN(count) || (count !== 0 && (count < 2 || count > 5))) {
      alert("Please enter 0 or a number between 2 and 5.");
      return;
    }
    if (count === 0) {
      // No components: go back to object name step or finish
      setStep("summary");
    } else {
      // Initialize empty rows for each component
      const details = [];
      for (let i = 0; i < count; i++) {
        details.push({ name: "", importance: "", connection: "" });
      }
      setComponentDetails(details);
      setStep("componentDetails");
    }
  };

  const handleComponentDetailChange = (index, field, value) => {
    const newDetails = [...componentDetails];
    newDetails[index][field] = value;
    setComponentDetails(newDetails);
  };

  const handleComponentDetailsSubmit = () => {
    // Validate each component entry
    for (let i = 0; i < componentDetails.length; i++) {
      const { name, importance, connection } = componentDetails[i];
      if (!name.trim() || !importance || !connection) {
        alert(`Please fill all fields for component ${i + 1}`);
        return;
      }
      const imp = parseInt(importance);
      const con = parseInt(connection);
      if (
        isNaN(imp) ||
        imp < 1 ||
        imp > 5 ||
        isNaN(con) ||
        con < 1 ||
        con > 5
      ) {
        alert(
          `For component ${
            i + 1
          }, "Importance" and "Connection" must be numbers between 1 and 5.`
        );
        return;
      }
    }
    setStep("summary");
  };

  const handleRestart = () => {
    // Optionally, restart the conversation
    setStep("intro");
    setObjectName("");
    setComponentCount("");
    setComponentDetails([]);
  };

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="chat-step">
            <p className="chat-text">{introMessage}</p>
            <div className="chat-actions">
              <button
                className="chat-btn bg-blue-500"
                onClick={() => setStep("continue")}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case "continue":
        return (
          <div className="chat-step">
            <p className="chat-text">Do you want to continue?</p>
            <div className="chat-actions">
              <button
                className="chat-btn bg-green-500"
                onClick={() => handleContinue("yes")}
              >
                Yes
              </button>
              <button
                className="chat-btn bg-red-500"
                onClick={() => handleContinue("no")}
              >
                No
              </button>
            </div>
          </div>
        );
      case "objectName":
        return (
          <div className="chat-step">
            <p className="chat-text">
              What is the name of the object you want to evaluate? (e.g., car,
              home, job, school, hotel, etc.)
            </p>
            <input
              type="text"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              className="chat-input"
              placeholder="Enter object name"
            />
            <div className="chat-actions">
              <button
                className="chat-btn bg-blue-500"
                onClick={handleObjectNameSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        );
      case "componentCount":
        return (
          <div className="chat-step">
            <p className="chat-text">
              How many components do you want to define? (Enter 0 if none, or a
              number between 2 and 5)
            </p>
            <input
              type="number"
              value={componentCount}
              onChange={(e) => setComponentCount(e.target.value)}
              className="chat-input"
              placeholder="Enter number of components"
            />
            <div className="chat-actions">
              <button
                className="chat-btn bg-blue-500"
                onClick={handleComponentCountSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        );
      case "componentDetails":
        return (
          <div className="chat-step">
            <p className="chat-text mb-4">Enter details for each component:</p>
            <table className="chat-table">
              <thead>
                <tr>
                  <th>Component Name</th>
                  <th>Importance (1-5)</th>
                  <th>Connection (1-5)</th>
                </tr>
              </thead>
              <tbody>
                {componentDetails.map((comp, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) =>
                          handleComponentDetailChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="chat-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={comp.importance}
                        onChange={(e) =>
                          handleComponentDetailChange(
                            index,
                            "importance",
                            e.target.value
                          )
                        }
                        className="chat-table-input"
                        min="1"
                        max="5"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={comp.connection}
                        onChange={(e) =>
                          handleComponentDetailChange(
                            index,
                            "connection",
                            e.target.value
                          )
                        }
                        className="chat-table-input"
                        min="1"
                        max="5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="chat-actions">
              <button
                className="chat-btn bg-blue-500"
                onClick={handleComponentDetailsSubmit}
              >
                Next
              </button>
            </div>
          </div>
        );
      case "summary":
        return (
          <div className="chat-step">
            <h2 className="text-xl font-bold mb-2">Summary</h2>
            <p>
              <strong>Object Name:</strong> {objectName}
            </p>
            <p>
              <strong>Components:</strong>
            </p>
            <ul className="chat-list">
              {componentDetails.map((comp, index) => (
                <li key={index}>
                  {comp.name} - Importance: {comp.importance}, Connection:{" "}
                  {comp.connection}
                </li>
              ))}
            </ul>
            <div className="chat-actions">
              <button className="chat-btn bg-green-500" onClick={handleRestart}>
                Restart
              </button>
            </div>
          </div>
        );
      case "exit":
        return (
          <div className="chat-step">
            <p className="chat-text">Goodbye!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="DEMA-container">{renderStep()}</div>;
};

export default Dema;
