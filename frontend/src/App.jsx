import {useState} from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Generator from "./pages/Generator";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("orbit-session"));
  } catch {
    return null;
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [session, setSession] = useState(getSession);
  const [prompt, setPrompt] = useState("");
  const [projectId, setProjectId] = useState(null);
  const authenticate = (data) => {
    localStorage.setItem("orbit-session", JSON.stringify(data));
    setSession(data);
    setScreen(prompt ? "generator" : "home");
  };
  const generate = (value) => {
    setPrompt(value);
    setProjectId(null);
    setScreen(session ? "generator" : "login");
  };
  const openProject = (id) => {
    setProjectId(id);
    setScreen("generator");
  };
  const signOut = () => {
    localStorage.removeItem("orbit-session");
    setSession(null);
    setScreen("home");
  };
  if (screen === "login")
    return <Login onNavigate={setScreen} onSuccess={authenticate} />;
  if (screen === "register")
    return <Register onNavigate={setScreen} onSuccess={authenticate} />;
  if (screen === "generator")
    return (
      <Generator prompt={prompt} projectId={projectId} session={session} onNavigate={setScreen} />
    );
  return (
    <Home
      session={session}
      onNavigate={setScreen}
      onGenerate={generate}
      onOpenProject={openProject}
      onSignOut={signOut}
    />
  );
}
