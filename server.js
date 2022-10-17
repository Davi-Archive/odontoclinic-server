const express = require("express");
const app = express();

app.get("", (req, res) => {
  res.status(200).json({ message: "Server online" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`);
});
