import { useState, useRef, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Check, Upload } from "lucide-react";
import { useData, type TeamMember } from "../../data/store";
import { compressImage } from "../../utils/imageUtils";

function PhotoUpload({
  photo,
  name,
  onChange,
}: {
  photo: string | null;
  name: string;
  onChange: (src: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const src = await compressImage(file);
    onChange(src);
  }, [onChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#6a6460] block">
        Photo
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border border-dashed cursor-pointer transition-colors overflow-hidden ${
          dragOver
            ? "border-[#C8963E]/60 bg-[rgba(200,150,62,0.04)]"
            : "border-[rgba(240,237,230,0.12)] hover:border-[#C8963E]/40 bg-[#111110]"
        }`}
        style={{ height: "9rem" }}
      >
        {photo ? (
          <>
            <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-[#0A0A09]/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload size={14} className="text-[#C8963E]" />
              <span className="font-['Instrument_Sans'] text-xs text-[#C8963E]">Replace</span>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <Upload size={18} className="text-[#3a3a38]" />
            <p className="font-['Instrument_Sans'] text-xs text-[#5a5a58]">
              Drop photo or <span className="text-[#C8963E]">browse</span>
            </p>
            <p className="font-['Instrument_Sans'] text-[8px] tracking-wider text-[#3a3a38]">JPG · PNG · WEBP</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      {photo && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(null); }}
          className="font-['Instrument_Sans'] text-[10px] text-[#5a5a58] hover:text-red-400 transition-colors"
        >
          Remove photo
        </button>
      )}
    </div>
  );
}

function MemberForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<TeamMember>;
  onSave: (m: Omit<TeamMember, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<TeamMember, "id">>({
    name: initial?.name ?? "",
    role: initial?.role ?? "",
    bio: initial?.bio ?? "",
    photo: initial?.photo ?? null,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#6a6460] block mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="admin-input"
            placeholder="e.g. Ágúst Gunnlaugsson"
            required
          />
        </div>
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#6a6460] block mb-1.5">
            Role / Title *
          </label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="admin-input"
            placeholder="e.g. Senior Lighting Designer"
            required
          />
        </div>
      </div>

      <div>
        <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#6a6460] block mb-1.5">
          Short Bio
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="admin-input resize-none"
          rows={3}
          placeholder="Brief bio, focusing on expertise and approach..."
        />
      </div>

      <PhotoUpload
        photo={form.photo}
        name={form.name}
        onChange={(src) => setForm({ ...form, photo: src })}
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-6 py-2.5 hover:bg-[#E0B060] transition-colors"
        >
          <Check size={14} />
          Save member
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-6 py-2.5 hover:text-[#F0EDE6] hover:border-[rgba(240,237,230,0.2)] transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AdminTeam() {
  const { team, saveTeamMember, deleteTeamMember, createTeamMember } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const addMember = async (data: Omit<TeamMember, "id">) => {
    await createTeamMember(data);
    setShowForm(false);
  };

  const updateMember = async (id: string, data: Omit<TeamMember, "id">) => {
    await saveTeamMember({ ...data, id });
    setEditId(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-2">
            Studio
          </p>
          <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
            Team
          </h1>
          <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] mt-1">
            {team.length} team member{team.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && editId === null && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-5 py-2.5 hover:bg-[#E0B060] transition-colors shrink-0"
          >
            <Plus size={15} />
            Add member
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.07)] p-8">
          <h2 className="font-['Instrument_Sans'] text-base font-medium text-[#F0EDE6] mb-6 flex items-center gap-2">
            <Plus size={15} className="text-[#C8963E]" />
            New team member
          </h2>
          <MemberForm onSave={addMember} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Team list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {team.map((m) => (
          <div key={m.id} className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.07)]">
            {editId === m.id ? (
              <div className="p-8">
                <h2 className="font-['Instrument_Sans'] text-base font-medium text-[#F0EDE6] mb-6 flex items-center gap-2">
                  <Edit2 size={14} className="text-[#C8963E]" />
                  Edit member
                </h2>
                <MemberForm
                  initial={m}
                  onSave={(data) => updateMember(m.id, data)}
                  onCancel={() => setEditId(null)}
                />
              </div>
            ) : deleteId === m.id ? (
              <div className="p-7 flex items-center justify-between gap-6">
                <p className="font-['Instrument_Sans'] text-sm text-[#F0EDE6]">
                  Remove <span className="italic text-[#C8963E]">{m.name}</span> from the team?
                </p>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={async () => { await deleteTeamMember(m.id); setDeleteId(null); }}
                    className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-red-500/80 text-white px-5 py-2 hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-5 py-2 hover:text-[#F0EDE6] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-6 p-7">
                {/* Avatar */}
                <div className="w-14 h-14 shrink-0 overflow-hidden bg-[#1a1a18] border border-[rgba(240,237,230,0.06)]">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-['Libre_Bodoni'] italic text-lg text-[#3a3a38]">
                        {m.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Instrument_Sans'] text-sm font-medium text-[#F0EDE6] mb-0.5">
                    {m.name}
                  </h3>
                  <p className="font-['Instrument_Sans'] text-[8px] tracking-[0.2em] uppercase text-[#C8963E] mb-2">
                    {m.role}
                  </p>
                  <p className="font-['Instrument_Sans'] text-xs font-light text-[#6a6460] leading-relaxed line-clamp-2">
                    {m.bio}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditId(m.id); setShowForm(false); }}
                    className="w-8 h-8 border border-[rgba(240,237,230,0.1)] flex items-center justify-center text-[#6a6460] hover:text-[#C8963E] hover:border-[#C8963E]/40 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteId(m.id)}
                    className="w-8 h-8 border border-[rgba(240,237,230,0.1)] flex items-center justify-center text-[#6a6460] hover:text-red-400 hover:border-red-400/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
