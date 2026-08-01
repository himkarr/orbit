export default function Navbar({session, onNavigate, onSignOut}) {
  return (
    <nav className="sticky top-0 z-10 bg-transparent">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold tracking-tight text-white"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-white text-sm text-black">
            O
          </span>
          <span>Orbit</span>
        </button>
        {session ? (
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="grid size-7 place-items-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-200">
                {session.user.username.slice(0, 1).toUpperCase()}
              </span>
              <span className="text-xs text-neutral-400">{session.user.username}</span>
            </div>
            <button
              onClick={onSignOut}
              className="rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-300 transition hover:border-neutral-500 hover:text-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("login")}
            className="rounded-md bg-white px-3 py-2 text-xs font-bold text-black transition hover:bg-neutral-200"
          >
            Log in →
          </button>
        )}
      </div>
    </nav>
  );
}
