import { useState, useEffect } from "react";

export default function PromptBox({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter a prompt to generate your website...");

  const placeholders = [
    "Build a todo app...",
    "Create a landing page...",
    "Generate a portfolio site...",
    "Design a login form...",
    "Make a weather dashboard..."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 3000); // change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (prompt.trim()) onGenerate(prompt.trim());
  };

  return (
    <form
      onSubmit={submit}
      className="mt-9 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-left shadow-2xl shadow-black/30"
    >
      <label className="sr-only" htmlFor="prompt">
        Describe your website
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder={placeholder}
        className="min-h-28 w-full resize-none bg-transparent p-2 text-sm text-white outline-none"
      />
      <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
        <span className="text-xs text-neutral-500">Ready to build</span>
        <button
          disabled={!prompt.trim()}
          className="rounded-md bg-white px-4 py-2 text-xs font-bold text-black disabled:opacity-40"
        >
          Generate
        </button>
      </div>
    </form>
  );
}