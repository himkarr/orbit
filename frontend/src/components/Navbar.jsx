export default function Navbar({session, onNavigate, onSignOut}) {
  return (
    <nav className="border-b border-neutral-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          Orbit
        </button>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-neutral-500 sm:block">
              {session.user.username}
            </span>
            <button
              onClick={onSignOut}
              className="rounded-md border border-neutral-700 px-3 py-2 text-xs text-neutral-300"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("login")}
            className="rounded-md bg-white px-3 py-2 text-xs font-bold text-black"
          >
            Log in →
          </button>
        )}
      </div>
    </nav>
  );
}
