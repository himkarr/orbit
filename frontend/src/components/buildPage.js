export default function buildPage(files) {
  return files["index.html"]
    .replace(
      /<link[^>]*href=["']style\.css["'][^>]*>/i,
      `<style>${files["style.css"]}</style>`,
    )
    .replace(
      /<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
      `<script>${files["script.js"]}</script>`,
    );
}
