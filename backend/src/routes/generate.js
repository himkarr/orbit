app.post("/api/generate", protect, async (req, res, next) => {
  const {prompt, title = "Untitled project"} = req.body;
  if (!prompt?.trim())
    return res.status(400).json({error: "A prompt is required."});
  if (!process.env.GROQ_API_KEY)
    return res.status(500).json({error: "GROQ_API_KEY is not configured."});

  res.status(200).set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  let code = "";
  try {
    const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
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
      res.write(`data: ${JSON.stringify({type: "chunk", content})}\n\n`);
    }

    // The completed code is already in the browser. Persist it only after streaming finishes.
    const project = await Project.create({
      user: req.user._id,
      title,
      prompt,
      code,
    });
    res.write(
      `data: ${JSON.stringify({type: "saved", project: {id: project._id, title: project.title, createdAt: project.createdAt}})}\n\n`,
    );
    return res.end();
  } catch (error) {
    if (!res.headersSent) return next(error);
    res.write(
      `data: ${JSON.stringify({type: "error", error: "Generation could not be completed."})}\n\n`,
    );
    return res.end();
  }
});
