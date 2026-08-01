export default function Preview({files}) {
  const page = files["index.html"]
    .replace(
      /<link[^>]*href=["']style\.css["'][^>]*>/i,
      `<style>${files["style.css"]}</style>`,
    )
    .replace(
      /<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
      `<script>${files["script.js"]}</script>`,
    );

  return (
    <section className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
      <div className="flex h-11 items-center justify-between border-b border-neutral-800 px-4 font-mono text-[11px] text-neutral-500">
        <span>preview</span>
        <span>Live website</span>
      </div>
      <iframe
        title="Generated website preview"
        srcDoc={page}
        sandbox="allow-scripts"
        className="h-[520px] w-full bg-white"
      />
    </section>
  );
}
