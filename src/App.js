import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./styles/App.css";

function App() {
  const [selectedWaId, setSelectedWaId] = useState(null);

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar selectedWaId={selectedWaId} onSelectChat={setSelectedWaId} />
      <ChatWindow waId={selectedWaId} />
    </div>
  );
}

export default App;
