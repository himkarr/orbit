require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Groq = require("groq-sdk");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const protect = require("./middleware/authMiddleware");
const Project = require("./models/Project");
const buildMessages = require("./utils/promptBuilder");

const app = express();
const port = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.post("/api/generate", protect, async (req, res, next) => {
  const { prompt, title = "Untitled project" } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: "A prompt is required." });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY is not configured." });

  res.status(200).set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  let code = "";
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const stream = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: buildMessages(prompt),
      temperature: 0.4,
      max_completion_tokens: 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (!content) continue;
      code += content;
      res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
    }

    // The completed code is already in the browser. Persist it only after streaming finishes.
    const project = await Project.create({ user: req.user._id, title, prompt, code });
    res.write(`data: ${JSON.stringify({ type: "saved", project: { id: project._id, title: project.title, createdAt: project.createdAt } })}\n\n`);
    return res.end();
  } catch (error) {
    if (!res.headersSent) return next(error);
    res.write(`data: ${JSON.stringify({ type: "error", error: "Generation could not be completed." })}\n\n`);
    return res.end();
  }
});

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
