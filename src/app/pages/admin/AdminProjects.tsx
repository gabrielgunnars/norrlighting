import { useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, ExternalLink, AlertTriangle, X } from "lucide-react";
import { useData, type Project } from "../../data/store";

function DeleteDialog({
  project,
  onConfirm,
  onCancel,
}: {
  project: Project;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.1)] p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <div>
            <p className="font-['Instrument_Sans'] text-sm text-[#F0EDE6] font-medium">
              Delete project?
            </p>
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1 leading-relaxed">
              <span className="text-[#a09880]">{project.name}</span> will be permanently removed
              and cannot be recovered.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-red-500 text-white px-5 py-2.5 hover:bg-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
          <button
            onClick={onCancel}
            className="font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-5 py-2.5 hover:text-[#F0EDE6] hover:border-[rgba(240,237,230,0.2)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (p: Project) => void;
}) {
  const { getCoverImage } = useData();
  const cover = getCoverImage(project);

  return (
    <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 hover:border-[rgba(240,237,230,0.1)] transition-colors">
      {/* Thumbnail */}
      <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 overflow-hidden bg-[#111110]">
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#1a1a18]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-['Instrument_Sans'] text-sm font-medium text-[#F0EDE6] truncate">
          {project.name}
        </h3>
        <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.2em] uppercase text-[#5a5a58] mt-0.5 truncate">
          {[project.category, project.year].filter(Boolean).join(" · ")}
        </p>
      </div>

      {/* Image count badge — tablet+ */}
      <span className="hidden sm:block font-['Instrument_Sans'] text-[8px] tracking-wider text-[#4a4a48] shrink-0">
        {project.images.length} img{project.images.length !== 1 ? "s" : ""}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          to={`/projects/${project.slug}`}
          target="_blank"
          title="View on site"
          className="hidden sm:flex w-8 h-8 border border-[rgba(240,237,230,0.07)] items-center justify-center text-[#4a4a48] hover:text-[#C8963E] hover:border-[#C8963E]/30 transition-colors"
        >
          <ExternalLink size={11} />
        </Link>
        <Link
          to={`/admin/projects/${project.id}`}
          title="Edit project"
          className="w-8 h-8 border border-[rgba(240,237,230,0.07)] flex items-center justify-center text-[#4a4a48] hover:text-[#C8963E] hover:border-[#C8963E]/30 transition-colors"
        >
          <Pencil size={11} />
        </Link>
        <button
          onClick={() => onDelete(project)}
          title="Delete project"
          className="w-8 h-8 border border-[rgba(240,237,230,0.07)] flex items-center justify-center text-[#4a4a48] hover:text-red-400 hover:border-red-400/30 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

export function AdminProjects() {
  const { projects, deleteProject } = useData();
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const handleConfirmDelete = async () => {
    if (toDelete) {
      await deleteProject(toDelete.id);
      setToDelete(null);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
              Portfolio
            </p>
            <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
              Projects
            </h1>
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
              {projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio
            </p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-5 py-2.5 hover:bg-[#E0B060] transition-colors shrink-0 mt-1"
          >
            <Plus size={13} />
            New project
          </Link>
        </div>

        {/* Project list */}
        {projects.length === 0 ? (
          <div className="bg-[#0d0d0c] border border-dashed border-[rgba(240,237,230,0.08)] flex flex-col items-center justify-center gap-4 py-20">
            <p className="font-['Instrument_Sans'] text-sm text-[#4a4a48]">No projects yet</p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm text-[#C8963E] border border-[#C8963E]/40 px-5 py-2.5 hover:bg-[rgba(200,150,62,0.08)] transition-colors"
            >
              <Plus size={13} />
              Create your first project
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {projects.map((p) => (
              <ProjectRow key={p.id} project={p} onDelete={setToDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {toDelete && (
        <DeleteDialog
          project={toDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
