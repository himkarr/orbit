import {useEffect, useState} from "react";
import ProjectCard from "../components/ProjectCard";
import {deleteProject, getProjects, updateProject} from "../services/api";

export default function History({token, onOpenProject}) {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getProjects(token)
      .then(({projects: savedProjects}) => !cancelled && setProjects(savedProjects))
      .catch((requestError) => !cancelled && setError(requestError.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [token]);

  function startEditing(project) {
    setEditingProject(project);
    setTitle(project.title);
  }

  async function saveTitle(event) {
    event.preventDefault();
    if (!editingProject || !title.trim()) return;

    try {
      const {project} = await updateProject(editingProject.id, {title: title.trim()}, token);
      setProjects((items) => items.map((item) => (item.id === project.id ? project : item)));
      setEditingProject(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function removeProject(id) {
    try {
      await deleteProject(id, token);
      setProjects((items) => items.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl border-neutral-800 px-5 py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Recent Projects</h2>
        </div>
        <span className="rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400">{projects.length} Saved</span>
      </div>

      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}
      {loading ? <p className="text-sm text-neutral-500">Loading projects...</p> : projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-800 p-5 text-sm text-neutral-500">Your generated projects will appear here.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={onOpenProject} onEdit={startEditing} onDelete={removeProject} />)}
        </div>
      )}

      {editingProject && (
        <form onSubmit={saveTitle} className="mt-6 flex max-w-lg gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="min-w-0 flex-1 rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm" aria-label="Project title" />
          <button className="rounded bg-white px-3 py-2 text-xs font-bold text-black">Save</button>
          <button type="button" onClick={() => setEditingProject(null)} className="px-2 text-xs text-neutral-400">Cancel</button>
        </form>
      )}
    </section>
  );
}
