import mongoose from "mongoose";

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment variables");
  }

  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 2000, // Faster timeout for serverless
    socketTimeoutMS: 10000,
    maxPoolSize: 5, // Connection pooling
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    family: 4,
    autoIndex: false,
  })
  .then((conn) => {
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error.message}`);
    connectionPromise = null; // Reset on failure
    throw error;
  });

  return connectionPromise;
};

// Export connection status for middleware
export const isDbConnected = () => isConnected && mongoose.connection.readyState === 1;

export default connectDB;
