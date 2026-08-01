require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const generateRoutes = require("./routes/generate");

const app = express();
const port = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/generate", generateRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found." }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error?.code === 11000) return res.status(409).json({ error: "That value is already in use." });
  if (error?.name === "ValidationError") return res.status(400).json({ error: error.message });
  return res.status(500).json({ error: "Internal server error." });
});

async function start() {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
}

start();

module.exports = app;
