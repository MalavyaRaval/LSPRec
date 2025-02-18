import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

const DemaChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const responses = {
      hello: "Hello! How can I assist you today?",
      help: "I can help answer your questions. Ask me anything!",
      default: "I'm here to help you!",
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
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-indigo-50 to-blue-50 rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-blue-100 bg-black/80">
        <h3 className="text-lg font-semibold text-white">DEMA Chat</h3>
      </div>

      <div
        className="flex-1 p-3 overflow-y-auto bg-gray-100"
        style={{ maxHeight: "300px" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Type a message to start...
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              } mb-3`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg shadow transition-colors duration-150 ${
                  message.isBot
                    ? "bg-white text-gray-800 border border-gray-200"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1">
                  {format(message.timestamp, "HH:mm")}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-100 bg-blue/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemaChat;
