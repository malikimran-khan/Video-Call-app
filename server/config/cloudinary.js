import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "voice_chats",
    resource_type: "auto", // Crucial for audio files
    allowed_formats: ["mp3", "wav", "m4a", "webm"],
  },
});

const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_files",
    resource_type: "auto",
    allowed_formats: [
      "jpg", "jpeg", "png", "gif", "webp",
      "mp4", "mov", "avi", "webm",
      "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt",
    ],
  },
});

export { cloudinary, storage, fileStorage };
