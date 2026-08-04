import Editor from "@monaco-editor/react";
import "./MonacoSetup";

function languageFor(filename) {
  const ext = (filename || "").split(".").pop();
  if (ext === "js") return "javascript";
  if (ext === "css") return "css";
  if (ext === "html") return "html";
  if (ext === "json") return "json";
  return "plaintext";
}

export default function CodeEditor({filename, code, onChange, editable = false, streaming}) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 px-4 font-mono text-[11px] text-neutral-500">
        <span>{filename}</span>
        <span className="flex items-center gap-2">
          <i
            className={`size-1.5 rounded-full ${streaming ? "bg-white animate-pulse" : "bg-neutral-600"}`}
          />
          {streaming ? "streaming" : editable ? "editing" : "complete"}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={languageFor(filename)}
          value={code}
          theme="vs-dark"
          onChange={editable ? (value) => onChange(value || "") : undefined}
          options={{
            readOnly: !editable,
            fontSize: 13,
            minimap: {enabled: false},
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
      </div>
    </section>
  );
}
