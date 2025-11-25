import mongoose from 'mongoose';

import UserModel from '../db/models/User';

// Connect to mongodb instance

export const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI);
    console.log("MongoDB Atlas connected");
    
  } catch (error) {
    throw error;
  }
};

// Disconnect from current mongodb instance

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
      console.log("MongoDB Atlas disconnected");
  } catch (error) {
    throw error;
  }
};

// Models Registration
export const User = UserModel;