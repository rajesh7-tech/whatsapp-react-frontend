import React, { useEffect, useState } from "react";
import { fetchChats } from "../api/api";

const Sidebar = ({ onSelectChat, selectedWaId }) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats();
        setChats(data);
      } catch (error) {
        setChats([]);
      }
    };
    loadChats();
  }, []);

  // Filter chats by search
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(search.toLowerCase()) ||
    chat.wa_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Chats
        <span className="sidebar-actions">
          {/* Compose icon */}
          <svg width="22" height="22" fill="#222" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          {/* Filter/menu icon */}
          <svg width="22" height="22" fill="#222" viewBox="0 0 24 24">
            <rect width="20" height="2" x="2" y="5" rx="1" fill="currentColor"/>
            <rect width="14" height="2" x="8" y="11" rx="1" fill="currentColor"/>
            <rect width="18" height="2" x="4" y="17" rx="1" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <input
        className="sidebar-search"
        placeholder="Search or start a new chat"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filteredChats.map((chat) => {
        const selected = chat.wa_id === selectedWaId;
        return (
          <div
            key={chat.wa_id}
            className={`sidebar-item${selected ? " selected" : ""}`}
            onClick={() => onSelectChat(chat.wa_id)}
          >
            <div className="avatar">
              {/* User icon SVG */}
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="#bdbdbd">
                <circle cx="12" cy="8" r="4"/>
                <ellipse cx="12" cy="17" rx="7" ry="4"/>
              </svg>
            </div>
            <div className="chat-info">
              <div style={{ fontWeight: 600 }}>{chat.name || chat.wa_id}</div>
              <small style={{ color: "#888" }}>{chat.wa_id}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
