const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// connect to dataBase
connectDB();

// init Midelware
app.use(cors());

app.use(express.json({ extended: false }));

//Define Routes

app.use("/api/users", require("./routes/auth/users"));
app.use("/api/auth", require("./routes/auth/auth"));
app.use("/api/researchs", require("./routes/Confirance"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
);

const PORT = process.env.PORT || 2020;

app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
});
