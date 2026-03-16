import api from "../../components/api/axios";
import type { IMessage } from "./chatTypes";

// Fetch messages with selected user or group
const fetchMessages = async (userId: string, isGroupChat?: boolean): Promise<IMessage[]> => {
  const response = await api.get(`/messages/${userId}${isGroupChat ? "?isGroupChat=true" : ""}`);
  return response.data;
};

// Send message
const sendMessage = async (data: {
  receiver: string;
  text: string;
  isGroupChat?: boolean;
}): Promise<IMessage> => {
  const response = await api.post("/messages", data);
  return response.data;
};

// Upload voice message
const uploadVoice = async (data: {
  receiver: string;
  audio: Blob;
  text?: string;
  isGroupChat?: boolean;
}): Promise<IMessage> => {
  const formData = new FormData();
  formData.append("receiver", data.receiver);
  if (data.text) {
    formData.append("text", data.text);
  }
  if (data.isGroupChat) {
    formData.append("isGroupChat", "true");
  }
  formData.append("audio", data.audio, "voice_message.webm");

  const response = await api.post("/messages/upload-voice", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Upload file (image, video, document)
const uploadFile = async (data: {
  receiver: string;
  file: File;
  isGroupChat?: boolean;
}): Promise<IMessage> => {
  const formData = new FormData();
  formData.append("receiver", data.receiver);
  if (data.isGroupChat) {
    formData.append("isGroupChat", "true");
  }
  formData.append("file", data.file);

  const response = await api.post("/messages/upload-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete message
const deleteMessage = async (messageId: string): Promise<any> => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

const chatService = {
  fetchMessages,
  sendMessage,
  uploadVoice,
  uploadFile,
  deleteMessage,
};

export default chatService;
