import React, { useState } from "react";
import { sendMessage } from "../api/api";

const MessageInput = ({ waId, onNewMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      from: "me",
      id: Date.now().toString(),
      timestamp: (Date.now() / 1000).toString(),
      text: { body: input },
      type: "text",
      status: "sending",
    };

    onNewMessage(newMessage);
    setInput("");

    try {
      const res = await sendMessage(newMessage);
      if (res.status === "success") {
        onNewMessage({ ...newMessage, status: "read" }); // Blue tick immediately
      } else {
        onNewMessage({ ...newMessage, status: "sent" });
      }
    } catch (error) {
      onNewMessage({ ...newMessage, status: "failed" });
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        borderTop: "1px solid #ddd",
        background: "#f0f0f0",
        display: "flex",
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "10px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          background: "#075e54",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: "0",
        }}
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
