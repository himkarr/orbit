import {useState} from "react";
import {Navigate, Route, Routes, useLocation, useNavigate, useParams} from "react-router";
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

function ProjectRoute({session}) {
  const {projectId} = useParams();
  const navigate = useNavigate();
  if (!session) return <Navigate to="/login" replace state={{from: `/projects/${projectId}`}} />;
  return <Generator projectId={projectId} prompt="" session={session} onNavigate={() => navigate("/")} />;
}

function GenerateRoute({session}) {
  const location = useLocation();
  const navigate = useNavigate();
  const prompt = location.state?.prompt;

  if (!session)
    return <Navigate to="/login" replace state={{from: "/generate", prompt}} />;
  if (!prompt?.trim()) return <Navigate to="/" replace />;

  return <Generator prompt={prompt} session={session} onNavigate={() => navigate("/")} />;
}

export default function App() {
  const [session, setSession] = useState(getSession);
  const location = useLocation();
  const navigate = useNavigate();

  const navigateTo = (screen) => {
    const paths = {home: "/", login: "/login", register: "/register", generator: "/generate"};
    navigate(paths[screen] || "/");
  };
  const authenticate = (data) => {
    localStorage.setItem("orbit-session", JSON.stringify(data));
    setSession(data);
    const {from, prompt} = location.state || {};
    navigate(from || "/", {replace: true, state: from === "/generate" ? {prompt} : undefined});
  };
  const generate = (prompt) => navigate("/generate", {state: {prompt}});
  const openProject = (id) => navigate(`/projects/${id}`);
  const signOut = () => {
    localStorage.removeItem("orbit-session");
    setSession(null);
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            session={session}
            onNavigate={navigateTo}
            onGenerate={generate}
            onOpenProject={openProject}
            onSignOut={signOut}
          />
        }
      />
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login onNavigate={navigateTo} onSuccess={authenticate} />} />
      <Route path="/register" element={session ? <Navigate to="/" replace /> : <Register onNavigate={navigateTo} onSuccess={authenticate} />} />
      <Route path="/generate" element={<GenerateRoute session={session} />} />
      <Route path="/projects/:projectId" element={<ProjectRoute session={session} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
