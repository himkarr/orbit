export default function CodeEditor({filename, code, streaming}) {
  const lines = code ? code.split("\n") : [];
  return (
    <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
      <div className="flex h-11 items-center justify-between border-b border-neutral-800 px-4 font-mono text-[11px] text-neutral-500">
        <span>{filename}</span>
        <span className="flex items-center gap-2">
          <i
            className={`size-1.5 rounded-full ${streaming ? "bg-white animate-pulse" : "bg-neutral-600"}`}
          />
          {streaming ? "streaming" : "complete"}
        </span>
      </div>
      <pre className="min-h-[420px] overflow-auto p-4 font-mono text-xs leading-6 text-neutral-200">
        {lines.map((line, index) => (
          <div className="grid grid-cols-[36px_1fr]" key={`${line}-${index}`}>
            <span className="select-none text-right text-neutral-700">
              {index + 1}
            </span>
            <code className="pl-4 whitespace-pre-wrap break-words">{line}</code>
          </div>
        ))}
        {streaming && <span className="ml-10 animate-pulse text-white">|</span>}
      </pre>
    </section>
  );
}
