function Navbar() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between">
      <a href="/" className="text-xl font-bold tracking-tight">
        ✦ Orbit
      </a>
      <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
        Log in
      </button>
    </nav>
  );
}

export default Navbar;
