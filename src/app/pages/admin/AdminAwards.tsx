import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useData, type Award } from "../../data/store";

function AwardRow({ award }: { award: Award }) {
  const { saveAward, deleteAward } = useData();
  // Local state so typing doesn't trigger a DB write on every keystroke
  const [fields, setFields] = useState({
    name: award.name,
    result: award.result,
    subtext: award.subtext,
  });

  const persist = () => saveAward({ ...award, ...fields });

  return (
    <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-5 flex gap-5 items-start">
      <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] block mb-1.5">
            Organisation
          </label>
          <input
            type="text"
            className="admin-input w-full"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            onBlur={persist}
            placeholder="e.g. DARC Awards"
          />
        </div>
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] block mb-1.5">
            Result
          </label>
          <input
            type="text"
            className="admin-input w-full"
            value={fields.result}
            onChange={(e) => setFields((f) => ({ ...f, result: e.target.value }))}
            onBlur={persist}
            placeholder="e.g. Winner"
          />
        </div>
        <div>
          <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] block mb-1.5">
            Category
          </label>
          <input
            type="text"
            className="admin-input w-full"
            value={fields.subtext}
            onChange={(e) => setFields((f) => ({ ...f, subtext: e.target.value }))}
            onBlur={persist}
            placeholder="e.g. Landscape Lighting"
          />
        </div>
      </div>

      <button
        onClick={async () => {
          if (window.confirm("Delete this award?")) await deleteAward(award.id);
        }}
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

  const addAward = async () => {
    await createAward({ image: null, name: "", result: "Winner", subtext: "" });
  };

  return (
    <div style={{ maxWidth: "52rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
            Homepage
          </p>
          <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
            Awards
          </h1>
          <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
            Recognition shown on the homepage. Fields are saved when you click out of them.
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

      {awards.length === 0 ? (
        <div className="border border-dashed border-[rgba(240,237,230,0.1)] flex flex-col items-center justify-center gap-3 py-16">
          <p className="font-['Instrument_Sans'] text-sm text-[#3a3a38]">No awards yet</p>
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
