/**
 * MongoDB connection helper
 *
 * Connects to the MongoDB instance specified by MONGO_URI in the
 * environment. Logs the connected host on success or exits the
 * process with code 1 on failure so the app doesn't start in a
 * broken state.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
