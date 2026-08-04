import buildPage from "./buildPage";

export default function Preview({files}) {
  return (
    <section className="flex h-full flex-col bg-neutral-950">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 px-4 font-mono text-[11px] text-neutral-500">
        <span>preview</span>
        <span>Live website</span>
      </div>
      <iframe
        title="Generated website preview"
        srcDoc={buildPage(files)}
        sandbox="allow-scripts allow-forms"
        className="min-h-0 flex-1 bg-white"
      />
    </section>
  );
}
