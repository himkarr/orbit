import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import History from "./History";
import backgroundImage from "../assets/bg.png";
export default function Home({session, onNavigate, onGenerate, onOpenProject, onSignOut}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url(${backgroundImage})`}}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/20 to-neutral-950"
      />
      <Navbar session={session} onNavigate={onNavigate} onSignOut={onSignOut} />
      <section className="relative">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 pb-20 pt-28 text-center">
          <h1 className="mt-5 text-5xl font-bold leading-none tracking-tight sm:text-5xl">
            What will you build today?
          </h1>
          <p className="mt-5 text-sm text-neutral-400">
            Describe your idea and Orbit will turn it into a working website.
          </p>
          <PromptBox onGenerate={onGenerate} />
        </div>
      </section>
      {session && <History token={session.token} onOpenProject={onOpenProject} />}
    </main>
  );
}
