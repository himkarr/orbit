import {useEffect, useState} from "react";
import CodeEditor from "../components/CodeEditor";
import Preview from "../components/Preview";
import {getProject, streamGeneration} from "../services/api";

const fileNames = ["index.html", "style.css", "script.js"];

function getFiles(response) {
  const json = response
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "");
  const generatedFiles = JSON.parse(json).files;

  if (!Array.isArray(generatedFiles))
    throw new Error("The response does not contain a files list.");
  const files = Object.fromEntries(
    generatedFiles.map(({filename, content}) => [filename, content]),
  );

  if (!fileNames.every((filename) => typeof files[filename] === "string"))
    throw new Error("The generated project is missing one or more files.");

  return files;
}

export default function Generator({prompt, projectId, session, onNavigate}) {
  const [mode, setMode] = useState("code");
  const [rawCode, setRawCode] = useState("");
  const [files, setFiles] = useState(null);
  const [activeFile, setActiveFile] = useState("index.html");
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let generatedCode = "";

    if (projectId) {
      getProject(projectId, session.token)
        .then(({project: savedProject}) => {
          if (cancelled) return;
          setProject(savedProject);
          setRawCode(savedProject.code);
          setFiles(getFiles(savedProject.code));
        })
        .catch((requestError) => !cancelled && setError(requestError.message))
        .finally(() => !cancelled && setStreaming(false));

      return () => {
        cancelled = true;
      };
    }

    streamGeneration({
      prompt,
      token: session.token,
      onChunk: (chunk) => {
        generatedCode += chunk;
        if (!cancelled) setRawCode((code) => code + chunk);
      },
      onSaved: (savedProject) => !cancelled && setProject(savedProject),
    })
      .then(() => {
        if (cancelled) return;
        try {
          setFiles(getFiles(generatedCode));
        } catch {
          setError(
            "The generated response was not a valid three-file project.",
          );
        }
      })
      .catch((streamError) => !cancelled && setError(streamError.message))
      .finally(() => !cancelled && setStreaming(false));

    return () => {
      cancelled = true;
    };
  }, [prompt, projectId, session.token]);

  const displayedCode = files ? files[activeFile] : rawCode;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="grid size-6 place-items-center rounded-full border border-white text-[10px]">
              O
            </span>
            Orbit
          </button>
          <p className="max-w-48 truncate text-xs text-neutral-500">
            {project?.title || "New project"}
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-300 onhover:border-neutral-500 hover:text-white"
          >
            Create New
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">
              {streaming
                ? "Building your project..."
                : project
                  ? projectId ? "Saved project" : "Saved to your projects"
                  : "Generation complete"}
            </p>
            <p className="mt-1 max-w-xl truncate text-sm text-neutral-300">
              {project?.prompt || prompt}
            </p>
          </div>
          <div className="rounded-md border border-neutral-800 bg-neutral-900 p-1">
            <button
              className={`rounded px-3 py-1.5 text-xs ${mode === "response" ? "bg-neutral-700 text-white" : "text-neutral-500"}`}
              onClick={() => setMode("response")}
            >
              LLM Res.
            </button>
            <button
              className={`rounded px-3 py-1.5 text-xs ${mode === "code" ? "bg-neutral-700 text-white" : "text-neutral-500"}`}
              onClick={() => setMode("code")}
            >
              Code
            </button>
            <button
              disabled={!files}
              className={`rounded px-3 py-1.5 text-xs ${mode === "preview" ? "bg-neutral-700 text-white" : "text-neutral-500"}`}
              onClick={() => setMode("preview")}
            >
              Preview
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-300">
            {error}
          </div>
        )}

        {mode === "response" ? (
          <CodeEditor filename="ai-response.json" code={rawCode} streaming={streaming} />
        ) : mode === "code" ? (
          <>
            <div className="mb-3 flex gap-2">
              {fileNames.map((filename) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`rounded-md border px-3 py-2 font-mono text-xs ${activeFile === filename ? "border-neutral-500 bg-neutral-800 text-white" : "border-neutral-800 text-neutral-500"}`}
                >
                  {filename}
                </button>
              ))}
            </div>
            <CodeEditor
              filename={files ? activeFile : "generating.json"}
              code={displayedCode}
              streaming={streaming}
            />
          </>
        ) : files ? (
          <Preview files={files} />
        ) : null}
      </div>
    </main>
  );
}
