const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const app = express();
dotenv.config();

const connectDB = require("./config/db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("", (req, res) => {
  res
    .status(200)
    .json({ message: "Server online", uri: process.env.MONGO_URI });
});

app.use("/api/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`.brightBlue.bold);
});
