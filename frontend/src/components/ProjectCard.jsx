function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectCard({project, onOpen, onEdit, onDelete}) {
  return (
    <article className="group relative min-h-44 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-900">
      <button
        onClick={() => onOpen(project.id)}
        className="block w-full text-left"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="grid size-9 place-items-center rounded-lg border border-neutral-700 bg-neutral-950 font-mono text-xs text-neutral-300">
            &lt;/&gt;
          </span>
          <span className="text-xs text-neutral-600">
            {formatDate(project.updatedAt)}
          </span>
        </div>
        <p className="truncate pr-12 text-base font-semibold text-neutral-100">
          {project.title}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-500">
          {project.prompt}
        </p>
      </button>
      <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onEdit(project)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-blue-600 hover:text-white shadow-sm transition-colors duration-200"
        >
          Rename
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-orange-600 hover:text-white shadow-sm transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
