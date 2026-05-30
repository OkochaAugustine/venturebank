const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function testDB() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log("DB Name:", mongoose.connection.name);

    await mongoose.disconnect();

    console.log("Disconnected cleanly");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(err.message);
  }
}

testDB();