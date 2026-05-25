import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Upload, X, Star, Loader2, AlertCircle } from "lucide-react";
import { useData, makeSlug, type Project } from "../../data/store";
import { compressImage } from "../../utils/imageUtils";

type FormData = {
  name: string;
  slug: string;
  category: string;
  location: string;
  year: string;
  description: string;
  details: string;
  images: string[];
  coverIndex: number;
};

const EMPTY: FormData = {
  name: "",
  slug: "",
  category: "",
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  details: "",
  images: [],
  coverIndex: 0,
};

const CATEGORIES = [
  "Extreme Environments",
  "Commercial & Hospitality",
  "Residential",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#5a5a58] mb-1.5">
      {children}
    </label>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="w-4 h-px bg-[#C8963E]/50" />
      <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#4a4a48]">
        {children}
      </p>
    </div>
  );
}

export function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, saveProject, createProject } = useData();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormData>(EMPTY);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when editing
  useEffect(() => {
    if (!id) return;
    const project = projects.find((p) => p.id === id);
    if (!project) {
      navigate("/admin/projects");
      return;
    }
    setForm({
      name: project.name,
      slug: project.slug,
      category: project.category,
      location: project.location,
      year: project.year,
      description: project.description,
      details: project.details,
      images: [...project.images],
      coverIndex: project.coverIndex,
    });
    setSlugManual(true);
  }, [id, projects, navigate]);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : makeSlug(name),
    }));
    if (error) setError("");
  };

  const handleSlugChange = (raw: string) => {
    setSlugManual(true);
    setField("slug", raw.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const addImages = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    const results = await Promise.all(arr.map((f) => compressImage(f)));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...results] }));
  }, []);

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const images = prev.images.filter((_, i) => i !== idx);
      let coverIndex = prev.coverIndex;
      if (idx < coverIndex) coverIndex--;
      else if (idx === coverIndex) coverIndex = 0;
      return { ...prev, images, coverIndex: Math.max(0, Math.min(coverIndex, images.length - 1)) };
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addImages(e.dataTransfer.files);
  };

  const validate = (): string => {
    if (!form.name.trim()) return "Project name is required.";
    if (!form.slug.trim()) return "Slug is required.";
    const conflict = projects.find((p) => p.slug === form.slug && p.id !== id);
    if (conflict) return `Slug "${form.slug}" is already used by "${conflict.name}".`;
    return "";
  };

  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);

    const data: Omit<Project, "id" | "createdAt"> = {
      slug: form.slug,
      name: form.name,
      category: form.category,
      location: form.location,
      year: form.year,
      description: form.description,
      details: form.details,
      images: form.images,
      coverIndex: form.coverIndex,
    };

    if (isEdit && id) {
      const existing = projects.find((p) => p.id === id)!;
      saveProject({ ...existing, ...data });
    } else {
      createProject(data);
    }
    navigate("/admin/projects");
  };

  return (
    <div style={{ maxWidth: "48rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div>
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 font-['Instrument_Sans'] text-xs text-[#5a5a58] hover:text-[#a09880] transition-colors group"
          style={{ marginBottom: "1.25rem", display: "inline-flex" }}
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to projects
        </Link>
        <p className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-2">
          {isEdit ? "Edit Project" : "New Project"}
        </p>
        <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
          {isEdit ? (form.name || "Edit Project") : "Create Project"}
        </h1>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2.5 border border-red-400/30 bg-red-900/20 px-4 py-3">
          <AlertCircle size={14} className="text-red-400 shrink-0" />
          <p className="font-['Instrument_Sans'] text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* ── Project Info ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SectionDivider>Project Information</SectionDivider>

        <div>
          <FieldLabel>Project Name *</FieldLabel>
          <input
            className="admin-input"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Kerið — The Crater"
          />
        </div>

        <div>
          <FieldLabel>URL Slug *</FieldLabel>
          <div className="flex items-center border border-[rgba(240,237,230,0.1)] bg-[#1a1a18] focus-within:border-[#C8963E] transition-colors">
            <span className="font-['Space_Mono'] text-[10px] text-[#5a5a58] px-3 shrink-0 select-none">
              /projects/
            </span>
            <input
              className="flex-1 bg-transparent text-[#F0EDE6] text-sm font-['Instrument_Sans'] outline-none py-[0.625rem] pr-3 min-w-0"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="kerid-the-crater"
            />
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "1rem" }}>
          <div>
            <FieldLabel>Category</FieldLabel>
            <select
              className="admin-input"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              style={{ appearance: "none", cursor: "pointer" }}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Year</FieldLabel>
            <input
              className="admin-input"
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
              placeholder="2024"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Location</FieldLabel>
          <input
            className="admin-input"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            placeholder="e.g. Kerið, Iceland"
          />
        </div>
      </div>

      {/* ── Description ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SectionDivider>Description</SectionDivider>
        <div>
          <FieldLabel>Short Description</FieldLabel>
          <textarea
            className="admin-input"
            style={{ resize: "none" }}
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Shown on project cards and detail page intro…"
          />
        </div>
        <div>
          <FieldLabel>Project Details</FieldLabel>
          <textarea
            className="admin-input"
            style={{ resize: "none" }}
            rows={5}
            value={form.details}
            onChange={(e) => setField("details", e.target.value)}
            placeholder="Extended notes on process, challenges, approach…"
          />
        </div>
      </div>

      {/* ── Images ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SectionDivider>Images</SectionDivider>
        <p className="font-['Instrument_Sans'] text-xs font-light text-[#5a5a58]">
          The starred image is the cover shown on cards. Images are stored locally in the browser.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver
              ? "border-[#C8963E]/60 bg-[rgba(200,150,62,0.04)]"
              : "border-[rgba(240,237,230,0.1)] hover:border-[#C8963E]/40 bg-[#111110]"
          }`}
          style={{ minHeight: "7rem", padding: "2rem" }}
        >
          <Upload size={18} className="text-[#4a4a48]" />
          <p className="font-['Instrument_Sans'] text-sm text-[#5a5a58]">
            Drop images or{" "}
            <span className="text-[#C8963E]">click to browse</span>
          </p>
          <p className="font-['Space_Mono'] text-[8px] tracking-wider text-[#3a3a38]">
            JPG · PNG · WEBP
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addImages(e.target.files)}
          />
        </div>

        {/* Thumbnail grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {form.images.map((img, i) => {
              const isCover = i === form.coverIndex;
              return (
                <div key={i} className="relative group/img aspect-square overflow-hidden bg-[#111110]">
                  <img src={img} alt="" className="w-full h-full object-cover" />

                  {isCover && (
                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-[#C8963E] px-1.5 py-0.5">
                      <Star size={7} className="fill-[#0A0A09] text-[#0A0A09]" />
                      <span className="font-['Space_Mono'] text-[6px] text-[#0A0A09]">COVER</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#0A0A09]/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setField("coverIndex", i)}
                        className="flex items-center gap-1 font-['Instrument_Sans'] text-[10px] text-[#C8963E] border border-[#C8963E]/50 px-2 py-1 hover:bg-[rgba(200,150,62,0.15)] transition-colors"
                      >
                        <Star size={9} /> Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="flex items-center gap-1 font-['Instrument_Sans'] text-[10px] text-red-400 border border-red-400/30 px-2 py-1 hover:bg-red-400/10 transition-colors"
                    >
                      <X size={9} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div
        className="flex items-center gap-4 border-t border-[rgba(240,237,230,0.06)]"
        style={{ paddingTop: "2rem" }}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-8 py-3 hover:bg-[#E0B060] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Create Project"}
        </button>
        <Link
          to="/admin/projects"
          className="font-['Instrument_Sans'] text-sm text-[#5a5a58] hover:text-[#F0EDE6] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
