import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Hardcoded chats for demo - replace with real backend call later
export const fetchChats = async () => {
  return [
    { wa_id: "12345", name: "Alice" },
    { wa_id: "67890", name: "Bob" },
  ];
};

export const fetchMessages = async (wa_id) => {
  const response = await api.get(`/messages/${wa_id}`);
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await api.post("/message", message);
  return response.data;
};

export const updateMessageStatus = async (messageId, status) => {
  const response = await api.patch(`/message/status/${messageId}`, { status });
  return response.data;
};
