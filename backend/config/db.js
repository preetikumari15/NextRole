const dns = require("dns");
const mongoose = require("mongoose");

// Fix MongoDB SRV DNS resolution on this network
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    process.exit(1);
  }
};

module.exports = connectDB;