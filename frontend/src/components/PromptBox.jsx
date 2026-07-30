import { useState } from "react";

const API_URL = "http://localhost:3000/api/generate";

function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setOutput(data.output);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-violet-100">
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
            disabled={!prompt.trim() || isLoading}
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? "Generating..." : "Generate ✦"}
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {output && (
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-left text-sm text-slate-100">
          {output}
        </pre>
      )}
    </div>
  );
}

export default PromptBox;
