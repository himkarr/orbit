require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Groq = require("groq-sdk");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

app.post("/api/generate", async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
        // model: "llama-3.3-70b-versatile",
      model: "openai/gpt-oss-20b",
      messages: [
        {role: "system", content: "You are a Professional site builder."},
        {role: "user", content: req.body.prompt},
      ],
      temperature: 0.7,
        max_completion_tokens: 2048,
      
    });

    res.json({output: completion.choices[0]?.message?.content ?? ""});
  } catch (error) {
    res.status(500).json({error: "Generation failed"});
  }
});

// async function main() {
//   const stream = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "user",
//         content: "Give a todo code in html, css and js",
//       },
//     ],
//     stream: true,
//   });

//   for await (const chunk of stream) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || "");
//   }

//   console.log("\n\nGroq API is working");
// }

// main().catch((error) => {
//   console.error("\nGroq API failed:", error.message);
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
