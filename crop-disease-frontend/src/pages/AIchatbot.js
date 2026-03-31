import React, { useState } from "react";
import API from "../services/api";
import "../components/AIchatbot.css";
import { FaTimes, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I’m your CropGuard AI assistant 🌿. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/ai/chat", {
        message: currentInput,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply || "Sorry, I could not generate a reply.",
        },
      ]);
    } catch (error) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong while contacting AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chatbox" onClick={(e) => e.stopPropagation()}>
        <div className="ai-chat-header">
          <div>
            <h3>AI Help</h3>
            <p>CropGuard Assistant</p>
          </div>

          <button className="ai-chat-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`ai-chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <div className="ai-chat-icon">
                {msg.sender === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="ai-chat-bubble">{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="ai-chat-message bot">
              <div className="ai-chat-icon">
                <FaRobot />
              </div>
              <div className="ai-chat-bubble">Typing...</div>
            </div>
          )}
        </div>

        <div className="ai-chat-input-area">
          <input
            type="text"
            placeholder="Ask something about CropGuard..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} disabled={loading}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;