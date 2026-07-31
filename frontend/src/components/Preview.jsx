export default function Preview({code}) {
  return (
    <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
      <div className="flex h-11 items-center justify-between border-b border-neutral-800 px-4 font-mono text-[11px] text-neutral-500">
        <span>preview</span>
        <span>Generated source</span>
      </div>
      <pre className="min-h-[420px] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-xs leading-6 text-neutral-200">
        {code}
      </pre>
    </section>
  );
}
