const SYSTEM_PROMPT = require("./systemPrompt");

function buildMessages(userPrompt) {
  const prompt = `
Generate a complete frontend website.

User Request:

${userPrompt.trim()}
`;

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

module.exports = buildMessages;
