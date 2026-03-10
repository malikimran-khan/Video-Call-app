export interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  text?: string;
  messageType: "text" | "voice" | "image" | "video" | "document";
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  // Optimistic upload fields (client-only)
  uploadStatus?: "uploading" | "failed";
  localPreviewUrl?: string;
  // Delete support
  deletedBySender?: boolean;
}
