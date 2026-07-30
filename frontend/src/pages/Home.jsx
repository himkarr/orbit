import PromptBox from "../components/PromptBox";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-6 py-6 text-slate-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">✦ Orbit</a>
        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">Log in</button>
      </nav>

      <section className="mx-auto flex max-w-3xl flex-col items-center py-28 text-center">
        <p className="mb-4 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">AI app builder</p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">What will you build today?</h1>
        <p className="my-6 max-w-xl text-lg text-slate-600">Describe your idea and let Orbit turn it into a working website.</p>
        <PromptBox />
      </section>
    </main>
  );
}

export default Home;
