import { useRef, useCallback } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { useData, type Award } from "../../data/store";

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target!.result as string);
    r.readAsDataURL(file);
  });
}

function AwardRow({ award }: { award: Award }) {
  const { saveAward, deleteAward } = useData();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const src = await readFile(file);
    saveAward({ ...award, image: src });
  }, [award, saveAward]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImage(file);
  };

  return (
    <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-5 flex gap-5 items-start">
      {/* Image zone */}
      <div
        className="shrink-0 relative overflow-hidden bg-[#111110] border border-[rgba(240,237,230,0.06)] cursor-pointer group/img hover:border-[#C8963E]/40 transition-colors"
        style={{ width: "140px", height: "105px" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {award.image ? (
          <>
            <img src={award.image} alt={award.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={16} className="text-[#F0EDE6]" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Upload size={18} className="text-[#3a3a38]" />
            <span className="font-['Space_Mono'] text-[7px] tracking-wider text-[#3a3a38] text-center">
              Drop image<br />or click
            </span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
        />
      </div>

      {/* Fields */}
      <div className="flex-1 min-w-0" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] block mb-1.5">
            Award name
          </label>
          <input
            type="text"
            className="admin-input w-full"
            value={award.name}
            onChange={(e) => saveAward({ ...award, name: e.target.value })}
            placeholder="e.g. DARC Awards"
          />
        </div>
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] block mb-1.5">
            Subtext
          </label>
          <input
            type="text"
            className="admin-input w-full"
            value={award.subtext}
            onChange={(e) => saveAward({ ...award, subtext: e.target.value })}
            placeholder="e.g. Winner · Architectural · 2018"
          />
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => { if (window.confirm("Delete this award?")) deleteAward(award.id); }}
        className="shrink-0 text-[#3a3a38] hover:text-red-400 transition-colors p-1 mt-0.5"
        title="Delete award"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function AdminAwards() {
  const { awards, createAward } = useData();

  const addAward = () => {
    createAward({ image: null, name: "New Award", subtext: "" });
  };

  return (
    <div style={{ maxWidth: "48rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
            Homepage
          </p>
          <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
            Awards
          </h1>
          <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
            Awards shown on the homepage under the hero. Upload an image and add a caption for each.
          </p>
        </div>
        <button
          onClick={addAward}
          className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-4 py-2.5 hover:bg-[#F0EDE6] transition-colors shrink-0"
        >
          <Plus size={14} />
          Add award
        </button>
      </div>

      {/* Award list */}
      {awards.length === 0 ? (
        <div className="border border-dashed border-[rgba(240,237,230,0.1)] flex flex-col items-center justify-center gap-3 py-16">
          <p className="font-['Instrument_Sans'] text-sm text-[#3a3a38]">
            No awards yet
          </p>
          <button
            onClick={addAward}
            className="flex items-center gap-2 font-['Instrument_Sans'] text-xs text-[#C8963E] border border-[#C8963E]/40 px-4 py-2 hover:bg-[rgba(200,150,62,0.08)] transition-colors"
          >
            <Plus size={12} />
            Add your first award
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {awards.map((award) => (
            <AwardRow key={award.id} award={award} />
          ))}
        </div>
      )}

      {awards.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={addAward}
            className="flex items-center gap-2 font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-4 py-2.5 hover:text-[#F0EDE6] hover:border-[rgba(240,237,230,0.2)] transition-colors"
          >
            <Plus size={13} />
            Add another
          </button>
        </div>
      )}
    </div>
  );
}
