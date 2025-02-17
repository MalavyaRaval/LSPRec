import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const Dema = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const projectId = query.get("projectId");
  const parentId = query.get("parentId");
  const username = query.get("username");
  const projectname = query.get("projectname");

  // Chat states
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [step, setStep] = useState("intro");
  const [objectName, setObjectName] = useState("");
  const [componentCount, setComponentCount] = useState("");
  const [componentDetails, setComponentDetails] = useState([]);

  const introMessage =
    "I am DEMA, your decision-making assistant. I can help you systematically evaluate alternatives and create structured project components.";
  const exitMessage =
    "Your components have been created successfully! Redirecting back to project...";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    if (step === "exit") {
      const timer = setTimeout(() => {
        navigate(`/user/${username}/project/${projectname}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, username, projectname]);

  const getBotResponse = async (userMessage) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const responses = {
      hello: "Hello! How can I assist you with your project today?",
      help: "I can help you with project documentation, requirements, and best practices. Ask me anything!",
      default:
        "I'm still learning. Please contact our support team for more complex queries.",
    };
    return responses[userMessage.toLowerCase()] || responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = {
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    const botResponse = await getBotResponse(inputValue);
    const botMessage = {
      text: botResponse,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) handleSendMessage();
  };

  // Create unique objects for each component using Array.from
  const handleComponentCountSubmit = () => {
    const count = parseInt(componentCount);
    if (isNaN(count) || (count !== 0 && (count < 2 || count > 5))) {
      alert("Please enter 0 or a number between 2 and 5.");
      return;
    }
    if (count === 0) {
      setStep("summary");
    } else {
      setComponentDetails(
        Array.from({ length: count }, () => ({
          name: "",
          importance: "",
          connection: "",
        }))
      );
      setStep("componentDetails");
    }
  };

  // Update only the field of the component at the given index
  const handleComponentDetailChange = (index, field, value) => {
    setComponentDetails((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleComponentDetailsSubmit = () => {
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
          `Component ${
            i + 1
          }: Importance and Connection must be numbers between 1 and 5`
        );
        return;
      }
    }
    setStep("summary");
  };

  // Create children nodes using the component details
  const handleCreateChildren = async () => {
    try {
      const children = componentDetails.map((detail, index) => ({
        id: Date.now() + index,
        name: detail.name,
        attributes: {
          importance: Number(detail.importance),
          connection: Number(detail.connection),
          created: Date.now(),
        },
        children: [],
        parent: parseInt(parentId),
      }));

      console.log("Creating children nodes:", children);
      await axios.post(
        `http://localhost:8000/api/projects/${projectId}/nodes`,
        {
          parentId: parseInt(parentId),
          children: children,
          metadata: {
            decisionProcess: "DEMA",
            objectName: objectName,
          },
        }
      );
      setStep("exit");
    } catch (error) {
      alert("Failed to create children nodes");
      console.error("Error details:", error.response?.data);
    }
  };

  const renderDecisionStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="p-4 bg-white rounded-lg m-4 shadow-md">
            <p className="text-black-700 mb-4">{introMessage}</p>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setStep("componentCount")}
              >
                Start Evaluation
              </button>
            </div>
          </div>
        );
      case "componentCount":
        return (
          <div className="p-4 bg-white rounded-lg m-4 shadow-md">
            <input
              type="number"
              value={componentCount}
              onChange={(e) => setComponentCount(e.target.value)}
              placeholder="Number of components (0, 2-5)"
              className="border p-2 rounded-lg w-full mb-2"
            />
            <button
              className="bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleComponentCountSubmit}
            >
              Continue
            </button>
          </div>
        );
      case "componentDetails":
        return (
          <div className="p-4 bg-white rounded-lg m-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Component Details</h3>
            {componentDetails.map((comp, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Component name"
                  value={comp.name}
                  onChange={(e) =>
                    handleComponentDetailChange(index, "name", e.target.value)
                  }
                  className="border p-2 rounded-lg w-full mb-2"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Importance (1-5)"
                    value={comp.importance}
                    onChange={(e) =>
                      handleComponentDetailChange(
                        index,
                        "importance",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded-lg w-1/2"
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Connection (1-5)"
                    value={comp.connection}
                    onChange={(e) =>
                      handleComponentDetailChange(
                        index,
                        "connection",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded-lg w-1/2"
                  />
                </div>
              </div>
            ))}
            <button
              className="bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleComponentDetailsSubmit}
            >
              Continue
            </button>
          </div>
        );
      case "summary":
        return (
          <div className="p-4 bg-white rounded-lg m-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <p className="mb-2">
              <strong>Object:</strong> {objectName}
            </p>
            <div className="mb-4">
              {componentDetails.map((comp, i) => (
                <div key={i} className="mb-2">
                  {comp.name} - Importance: {comp.importance}, Connection:{" "}
                  {comp.connection}
                </div>
              ))}
            </div>
            <button
              className="bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleCreateChildren}
            >
              Create Components
            </button>
          </div>
        );
      case "exit":
        return (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg m-4">
            {exitMessage}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-indigo-50 to-blue-50 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 p-4 border-b border-blue-100 bg-black/80">
        <div
          className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
            isLoading
              ? "bg-blue-200"
              : "bg-gradient-to-br from-blue-600 to-indigo-500"
          }`}
        >
          {isLoading && (
            <div className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-white-800">DEMA</h3>
      </div>

      {renderDecisionStep()}

      <div
        className="flex-1 bg-gray/20 p-3 overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isBot ? "justify-start" : "justify-end"
            } mb-3`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg transition-all duration-150 ${
                message.isBot
                  ? "bg-pink text-gray-800 shadow-sm border"
                  : "bg-gradient-to-br from-blue-600 to-indigo-500 text-black shadow-lg"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isBot ? "text-pink-500/80" : "text-blue-100/90"
                }`}
              >
                {format(message.timestamp, "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {step === "intro" && (
        <div className="p-4 border-t border-blue-100 bg-blue/80">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-400 transition-all bg-blue/90"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-black rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] shadow-md"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dema;
