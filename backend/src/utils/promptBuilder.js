const {systemPrompt} = require("./systemPrompt");

function buildMessages(userPrompt) {
  const prompt = `
Generate a complete frontend website.

User Request:

${userPrompt.trim()}
`;

  return [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
}

module.exports = buildMessages;
