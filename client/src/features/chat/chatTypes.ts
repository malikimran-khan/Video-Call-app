export interface IMessage {
  _id: string;
  sender: string | any;
  receiver: string | any;
  text?: string;
  messageType: "text" | "voice" | "image" | "video" | "document" | "call";
  fileUrl?: string;
  fileName?: string;
  callType?: "voice" | "video";
  callStatus?: "missed" | "declined" | "completed" | "no_answer";
  callDuration?: number;
  createdAt: string;
  updatedAt?: string;
  uploadStatus?: "uploading" | "failed";
  localPreviewUrl?: string;
  deletedBySender?: boolean;
  isGroupChat?: boolean;
}
