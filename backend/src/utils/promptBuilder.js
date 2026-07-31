function buildMessages(prompt) {
  return [
    { role: "system", content: "You build small, production-ready web interfaces. Return only the requested source code, with no Markdown fences or explanation." },
    { role: "user", content: prompt.trim() },
  ];
}

module.exports = buildMessages;
