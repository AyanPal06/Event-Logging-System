// Load environment variables from .env file
require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Access MongoDB URI from the environment variable
const uri = process.env.MONGO_URI;

// Log to check if the URI is loaded correctly
console.log("Mongo URI:", uri);  // Debugging step

// Check if MONGO_URI is undefined
if (!uri) {
  console.error("MONGO_URI is undefined. Please check your .env file.");
  process.exit(1);  // Exit the application if the URI is not found
}

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// Routes
app.use("/api", eventRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
