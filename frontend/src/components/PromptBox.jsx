import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const placeholders = [
  "Build a todo app...",
  "Create a landing page...",
  "Generate a portfolio site...",
  "Design a login form...",
  "Make a weather dashboard..."
];

export default function PromptBox({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter a prompt to generate your website...");

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
      className="mt-9 w-full rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 shadow-2xl shadow-black/50 backdrop-blur transition focus-within:border-neutral-700 focus-within:bg-neutral-900"
    >
      <label className="sr-only" htmlFor="prompt">
        Describe your website
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) submit(event);
        }}
        placeholder={placeholder}
        className="min-h-24 w-full resize-none bg-transparent p-1 text-sm text-white outline-none placeholder:text-neutral-500"
      />
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xs text-neutral-500">Ready to build</span>
        <button
          disabled={!prompt.trim()}
          className="group flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-neutral-200 disabled:opacity-40"
        >
          <Sparkles size={14} />
          Generate
          <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}