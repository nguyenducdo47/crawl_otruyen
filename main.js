const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/connectDB");
const {
  categoryRoute,
  comicRoute,
  analysisRoute,
  crawlRoute,
  genreRoute,
  searchRoute,
  viewRoute,
} = require("./routes");
const { PORT } = require("./constants");

const app = express();
const port = PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/the-loai", categoryRoute);
app.use("/truyen-tranh", comicRoute);
app.use("/analysis", analysisRoute);
app.use("/crawl", crawlRoute);
app.use("/tim-kiem", searchRoute);
app.use("/", genreRoute);
app.use("/views", viewRoute);

// Handle 404
app.use((req, res) => {
  res.json({
    status: 404,
    message: "Not Found",
  });
});

// Error handlers
app.use((err, req, res, next) => {
  const status = +(err.message.match(/\d+/) || 500);
  res.status(status).json({
    status,
    message: err.message,
  });
});

app.listen(port);
