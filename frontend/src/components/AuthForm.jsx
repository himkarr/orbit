import {useState} from "react";
import {register, signIn} from "../services/api";

export default function AuthForm({
  register: isRegister,
  title,
  text,
  submit,
  onNavigate,
  onSuccess,
}) {
  const [form, setForm] = useState({username: "", email: "", password: ""});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key) => (event) =>
    setForm({...form, [key]: event.target.value});

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSuccess(
        await (isRegister
          ? register(form)
          : signIn({email: form.email, password: form.password})),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-7 text-neutral-100">
      <button
        onClick={() => onNavigate("home")}
        className="flex items-center gap-2 font-bold tracking-tight"
      >
        Orbit
      </button>
      <section className="mx-auto mt-24 w-full max-w-sm">
        <p className="font-mono text-[10px] tracking-[0.16em] text-neutral-500">
          {isRegister ? "GET STARTED" : "WELCOME BACK"}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-400">{text}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isRegister && (
            <Field
              label="Full name"
              value={form.username}
              onChange={update("username")}
              minLength="2"
            />
          )}
          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={update("email")}
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            minLength="8"
          />
          {error && (
            <p className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-300">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded-md bg-white py-3 text-sm font-bold text-black disabled:opacity-50"
          >
            {busy ? "Please wait..." : `${submit} →`}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-neutral-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => onNavigate(isRegister ? "login" : "register")}
            className="text-white underline"
          >
            {isRegister ? "Sign in" : "Create one"}
          </button>
        </p>
      </section>
    </main>
  );
}

function Field({label, type = "text", value, onChange, minLength}) {
  return (
    <label className="block text-xs font-medium text-neutral-300">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        required
        className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm text-white outline-none transition focus:border-neutral-300"
      />
    </label>
  );
}
