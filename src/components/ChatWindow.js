import React, { useEffect, useState } from "react";
import { fetchMessages, updateMessageStatus } from "../api/api";
import MessageInput from "./MessageInput";

const ChatWindow = ({ waId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!waId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const msgs = await fetchMessages(waId);
      setMessages(msgs);

      for (const msg of msgs) {
        if (msg.status !== "read" && msg.from !== waId) {
          try {
            await updateMessageStatus(msg.id, "read");
          } catch (err) {
            console.error("Failed to update message status", err);
          }
        }
      }

      const updated = await fetchMessages(waId);
      setMessages(updated);
    };

    loadMessages();
  }, [waId]);

  if (!waId) {
    return <div style={{ padding: "20px" }}>Select a chat to start messaging</div>;
  }

  const handleNewMessage = (newMsg) => {
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === newMsg.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...newMsg };
        return updated;
      } else {
        return [...prev, newMsg];
      }
    });
  };

  const StatusIcon = ({ status, isSentByUser }) => {
    if (!isSentByUser) return null;

    const sendingIcon = (
      <div style={{ marginLeft: 5 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
          <circle
            cx="8"
            cy="8"
            r="7"
            stroke="#999"
            strokeWidth="2"
            fill="none"
            strokeDasharray="12 4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 8 8"
              to="360 8 8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );

    const failedIcon = <span style={{ marginLeft: 5, color: "red" }}>⚠</span>;

    const singleTick = (
      <svg width="16" height="16" style={{ marginLeft: 5 }} fill="#999">
        <path d="M5.5 8.5l2 2 4-4" stroke="#999" strokeWidth="1.5" fill="none" />
      </svg>
    );

    const doubleTickGray = (
      <span style={{ marginLeft: 5, display: "inline-flex" }}>
        <svg width="18" height="18" style={{ display: 'block' }}>
          <path
            d="M4.5 9.5l3 3 6-6"
            stroke="#999"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <svg width="18" height="18" style={{ marginLeft: -10, display: 'block' }}>
          <path
            d="M7.5 9.5l3 3 4-4"
            stroke="#999"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );

    const doubleTickBlue = (
      <span style={{ marginLeft: 5, display: 'inline-flex', position: 'relative', width: 20, height: 14 }}>
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: 0, top: 0 }}
        >
          <path
            d="M2 7L7 12L18 1"
            stroke="#34b7f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: 6, top: 0 }}
        >
          <path
            d="M2 7L7 12L18 1"
            stroke="#34b7f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );

    switch (status) {
      case "sending":
        return sendingIcon;
      case "failed":
        return failedIcon;
      case "sent":
        return singleTick;
      case "delivered":
        return doubleTickGray;
      case "read":
        return doubleTickBlue;
      default:
        return null;
    }
  };

  const getAvatarForChat = (waId) => "https://www.gravatar.com/avatar/?d=mp";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        height: "100vh",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          padding: "14px 18px 12px 16px",
          borderBottom: "1px solid #f1f1f1",
          minHeight: 56,
        }}
      >
        <img
          src={getAvatarForChat(waId)}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#e1e1e1",
            marginRight: 14,
          }}
        />
        <div
          style={{
            fontSize: "1.1em",
            fontWeight: "bold",
            color: "#222",
          }}
        >
          {waId}
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 16px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ece5dd",
        }}
      >
        {messages.map((msg, i) => {
          const isSentByUser = msg.from === "me";
          // Safely parse timestamp (handle decimal string)
          const ts = Math.floor(Number(msg.timestamp));
          const displayTime = !isNaN(ts)
            ? new Date(ts * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--";

          return (
            <div
              key={msg.id || i}
              style={{
                maxWidth: "60%",
                alignSelf: isSentByUser ? "flex-end" : "flex-start",
                marginBottom: 12,
                padding: "10px 14px",
                borderRadius: isSentByUser
                  ? "15px 15px 0 15px"
                  : "15px 15px 15px 0",
                backgroundColor: isSentByUser ? "#dcf8c6" : "#fff",
                fontSize: 14,
                boxShadow: isSentByUser
                  ? "0 1px 1px rgba(0,0,0,0.1)"
                  : "none",
              }}
            >
              <div>{msg.text?.body || msg.content}</div>
              <div
                style={{
                  fontSize: 10,
                  color: "#666",
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {displayTime}
                <StatusIcon status={msg.status} isSentByUser={isSentByUser} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <MessageInput
        waId={waId}
        onNewMessage={(msg) => {
          setMessages((prevMessages) => {
            const idx = prevMessages.findIndex((m) => m.id === msg.id);
            if (idx >= 0) {
              const updated = [...prevMessages];
              updated[idx] = { ...updated[idx], ...msg };
              return updated;
            }
            return [...prevMessages, msg];
          });
        }}
      />
    </div>
  );
};

export default ChatWindow;
