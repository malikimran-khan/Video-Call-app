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

// Upload voice message
const uploadVoice = async (data: {
  receiver: string;
  audio: Blob;
}): Promise<IMessage> => {
  const formData = new FormData();
  formData.append("receiver", data.receiver);
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
}): Promise<IMessage> => {
  const formData = new FormData();
  formData.append("receiver", data.receiver);
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
