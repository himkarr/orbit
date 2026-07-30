import { useState } from "react";

function PromptBox() {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    // Connect this to POST /api/generate when the backend is ready.
    console.log(prompt);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-violet-100"
    >
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Describe the app you want to build..."
        className="min-h-28 w-full resize-none rounded-xl p-3 text-slate-700 outline-none placeholder:text-slate-400"
      />
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-slate-400">Build with AI</span>
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate ✦
        </button>
      </div>
    </form>
  );
}

export default PromptBox;
