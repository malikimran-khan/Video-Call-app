import api from "../../components/api/axios";
import type { IMessage } from "./chatTypes";

// Fetch messages with selected user
const fetchMessages = async (userId: string): Promise<IMessage[]> => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

// Send message
const sendMessage = async (data: {
  receiver: string;
  text: string;
}): Promise<IMessage> => {
  const response = await api.post("/messages", data);
  return response.data;
};

const chatService = {
  fetchMessages,
  sendMessage,
};

export default chatService;
