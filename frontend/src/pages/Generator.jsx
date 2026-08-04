import {useEffect, useState} from "react";
import {
  Braces,
  FileCode,
  FileText,
  Globe,
  Pencil,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import CodeEditor from "../components/CodeEditor";
import Preview from "../components/Preview";
import buildPage from "../components/buildPage";
import {getProject, streamGeneration, updateProject} from "../services/api";

const fileNames = ["index.html", "style.css", "script.js"];

const fileIcons = {
  "index.html": FileCode,
  "style.css": FileText,
  "script.js": Braces,
};

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

function buildRawCode(files) {
  return JSON.stringify({
    files: fileNames.map((filename) => ({filename, content: files[filename]})),
  });
}

export default function Generator({prompt, projectId, session, onNavigate}) {
  const [mode, setMode] = useState("editor"); // "editor" | "response"
  const [rawCode, setRawCode] = useState("");
  const [files, setFiles] = useState(null);
  const [activeFile, setActiveFile] = useState("index.html");
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let generatedCode = "";
    const controller = new AbortController();

    // Deferring the request lets StrictMode's development-only effect replay
    // clean up before a stream is opened.
    const startRequest = () => {
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
        return;
      }

      streamGeneration({
        prompt,
        token: session.token,
        signal: controller.signal,
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
        .catch((streamError) => {
          if (!cancelled && streamError.name !== "AbortError")
            setError(streamError.message);
        })
        .finally(() => !cancelled && setStreaming(false));
    };
    const timer = window.setTimeout(startRequest, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [prompt, projectId, session.token]);

  const displayedCode = files ? files[activeFile] : rawCode;

  const handleFileChange = (value) =>
    setFiles((current) =>
      current ? {...current, [activeFile]: value} : current,
    );

  const handleSave = async () => {
    const target = project?.id || projectId;
    if (!target || !files) return;
    setSaving(true);
    setError("");
    try {
      const {project: saved} = await updateProject(
        target,
        {code: buildRawCode(files)},
        session.token,
      );
      setProject(saved);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => {
    if (!files) return;
    const url = URL.createObjectURL(
      new Blob([buildPage(files)], {type: "text/html"}),
    );
    window.open(url, "_blank");
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const FileIcon = fileIcons[activeFile] || FileCode;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-neutral-800 px-4">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <img
            src="/src/assets/logo.png"
            alt="Orbit Logo"
            className="h-8 w-8"
          />
          <span className="hidden sm:inline">Orbit</span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-center text-sm font-medium text-neutral-200">
            {project?.title || "New project"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setMode(mode === "editor" ? "response" : "editor")}
            className="hidden items-center gap-1.5 rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:text-white sm:flex"
            title="Toggle between the AI response and the split editor view"
          >
            <Sparkles size={14} />
            {mode === "editor" ? "LLM Res." : "Editor"}
          </button>

          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-neutral-200 disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
              >
                <X size={14} />
                Exit
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              disabled={!files || streaming}
              className="flex items-center gap-1.5 rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:text-white disabled:opacity-40"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={!files || streaming}
            className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-neutral-200 disabled:opacity-40"
          >
            <Globe size={14} />
            Publish
          </button>

          <button
            onClick={() => onNavigate("home")}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white"
          >
            Create New
          </button>
        </div>
      </header>

      {error && (
        <div className="shrink-0 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2 text-xs text-neutral-300">
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-52 shrink-0 flex-col border-r border-neutral-800 md:flex">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 px-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              Files
            </span>
            <span className="text-[11px] text-neutral-600">
              {fileNames.length}
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {fileNames.map((filename) => {
              const Icon = fileIcons[filename] || FileCode;
              return (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs ${activeFile === filename ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"}`}
                >
                  <Icon size={14} className="shrink-0 text-neutral-500" />
                  <span className="truncate">{filename}</span>
                  {editing && activeFile === filename && (
                    <span className="ml-auto size-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-neutral-800 p-3">
            <p className="text-[11px] text-neutral-500">Tip</p>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
              {editing
                ? "Click Save to keep your edits."
                : "Hit Edit to make changes, Publish to open the live site."}
            </p>
          </div>
        </aside>

        {mode === "response" ? (
          <section className="min-w-0 flex-1">
            <CodeEditor
              filename="ai-response.json"
              code={rawCode}
              streaming={streaming}
            />
          </section>
        ) : (
          <section className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-neutral-800 lg:border-b-0 lg:border-r">
              <div className="min-h-0 flex-1">
                <CodeEditor
                  filename={files ? activeFile : "generating.json"}
                  code={displayedCode}
                  editable={editing}
                  onChange={handleFileChange}
                  streaming={streaming}
                />
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {files ? (
                <Preview files={files} />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-600">
                  {streaming
                    ? "Waiting for preview..."
                    : "Preview will appear here."}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
