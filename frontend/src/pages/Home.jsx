import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import History from "./History";
import backgroundImage from "../assets/orbitbg.png";
export default function Home({session, onNavigate, onGenerate, onOpenProject, onSignOut}) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar session={session} onNavigate={onNavigate} onSignOut={onSignOut} />
      <section className="isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover opacity-55"
          style={{backgroundImage: `url(${backgroundImage})`, backgroundPosition: "center -80px"}}
        />
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
