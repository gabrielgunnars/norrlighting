import { useState } from "react";
import { Check } from "lucide-react";
import { useData, type SiteContent } from "../../data/store";

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-px bg-[#C8963E]/50" />
      <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#4a4a48]">
        {children}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48]">
        {label}
      </label>
      {rows ? (
        <textarea
          className="admin-input resize-none"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="admin-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && (
        <p className="font-['Instrument_Sans'] text-xs font-light text-[#3a3a38]">{hint}</p>
      )}
    </div>
  );
}

export function AdminContent() {
  const { siteContent, updateSiteContent } = useData();
  const [draft, setDraft] = useState<SiteContent>(() => JSON.parse(JSON.stringify(siteContent)));
  const [tab, setTab] = useState<"home" | "studio">("home");
  const [flashSaved, setFlashSaved] = useState(false);

  const save = () => {
    updateSiteContent(draft);
    setFlashSaved(true);
    setTimeout(() => setFlashSaved(false), 2500);
  };

  const setHome = (patch: Partial<SiteContent["home"]>) =>
    setDraft((d) => ({ ...d, home: { ...d.home, ...patch } }));

  const setStudio = (patch: Partial<SiteContent["studio"]>) =>
    setDraft((d) => ({ ...d, studio: { ...d.studio, ...patch } }));

  const setHomeService = (i: number, patch: Partial<{ title: string; desc: string }>) =>
    setDraft((d) => {
      const services = d.home.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
      return { ...d, home: { ...d.home, services } };
    });

  const setProcessStep = (i: number, patch: Partial<{ title: string; desc: string }>) =>
    setDraft((d) => {
      const processSteps = d.studio.processSteps.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
      return { ...d, studio: { ...d.studio, processSteps } };
    });

  const setDiscipline = (i: number, patch: Partial<{ title: string; desc: string }>) =>
    setDraft((d) => {
      const disciplines = d.studio.disciplines.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
      return { ...d, studio: { ...d.studio, disciplines } };
    });

  const setAward = (i: number, patch: Partial<{ name: string; sub: string; year: string; result: string }>) =>
    setDraft((d) => {
      const awards = d.studio.awards.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
      return { ...d, studio: { ...d.studio, awards } };
    });

  return (
    <div style={{ maxWidth: "48rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
            Content
          </p>
          <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
            Text Editor
          </h1>
          <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
            Edit all text content across the site
          </p>
        </div>
        <div className="flex items-center gap-4">
          {flashSaved && (
            <span className="flex items-center gap-1.5 font-['Space_Mono'] text-[8px] tracking-wider text-green-400">
              <Check size={10} /> Saved
            </span>
          )}
          <button
            onClick={save}
            className="font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-5 py-2.5 hover:bg-[#F0EDE6] transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(240,237,230,0.06)]">
        {(["home", "studio"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-['Instrument_Sans'] text-sm px-6 py-3 border-b-2 transition-colors capitalize ${
              tab === t
                ? "border-[#C8963E] text-[#F0EDE6]"
                : "border-transparent text-[#4a4a48] hover:text-[#a09880]"
            }`}
          >
            {t === "home" ? "Home" : "Studio"}
          </button>
        ))}
      </div>

      {/* HOME TAB */}
      {tab === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Hero</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Heading — white" value={draft.home.heroLine1} onChange={(v) => setHome({ heroLine1: v })} />
              <Field label="Heading — gold accent" value={draft.home.heroLine2} onChange={(v) => setHome({ heroLine2: v })} />
              <Field label="Description" value={draft.home.heroSubtext} onChange={(v) => setHome({ heroSubtext: v })} rows={3} />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Disciplines</SectionDivider>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {draft.home.services.map((s, i) => (
                <div key={i} className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p className="font-['Space_Mono'] text-[8px] tracking-[0.3em] text-[#C8963E] uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <Field label="Title" value={s.title} onChange={(v) => setHomeService(i, { title: v })} />
                  <Field label="Description" value={s.desc} onChange={(v) => setHomeService(i, { desc: v })} rows={3} />
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>CTA</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Heading — white" value={draft.home.ctaLine1} onChange={(v) => setHome({ ctaLine1: v })} />
              <Field label="Heading — gold accent" value={draft.home.ctaLine2} onChange={(v) => setHome({ ctaLine2: v })} />
              <Field label="Body text" value={draft.home.ctaBody} onChange={(v) => setHome({ ctaBody: v })} rows={3} />
            </div>
          </section>
        </div>
      )}

      {/* STUDIO TAB */}
      {tab === "studio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Hero</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6">
              <Field label="Description" value={draft.studio.heroDesc} onChange={(v) => setStudio({ heroDesc: v })} rows={3} />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>About</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Heading (use \n for line break)" value={draft.studio.aboutHeading} onChange={(v) => setStudio({ aboutHeading: v })} rows={2} />
              <Field label="Paragraph 1" value={draft.studio.aboutP1} onChange={(v) => setStudio({ aboutP1: v })} rows={4} />
              <Field label="Paragraph 2" value={draft.studio.aboutP2} onChange={(v) => setStudio({ aboutP2: v })} rows={4} />
              <Field label="Paragraph 3" value={draft.studio.aboutP3} onChange={(v) => setStudio({ aboutP3: v })} rows={4} />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Process</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Heading (use \n for line break)" value={draft.studio.processHeading} onChange={(v) => setStudio({ processHeading: v })} rows={2} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {draft.studio.processSteps.map((s, i) => (
                <div key={i} className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p className="font-['Space_Mono'] text-[8px] tracking-[0.3em] text-[#C8963E] uppercase">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>
                  <Field label="Title" value={s.title} onChange={(v) => setProcessStep(i, { title: v })} />
                  <Field label="Description" value={s.desc} onChange={(v) => setProcessStep(i, { desc: v })} rows={4} />
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Disciplines</SectionDivider>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {draft.studio.disciplines.map((s, i) => (
                <div key={i} className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p className="font-['Space_Mono'] text-[8px] tracking-[0.3em] text-[#C8963E] uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <Field label="Title" value={s.title} onChange={(v) => setDiscipline(i, { title: v })} />
                  <Field label="Description" value={s.desc} onChange={(v) => setDiscipline(i, { desc: v })} rows={3} />
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Awards</SectionDivider>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {draft.studio.awards.map((a, i) => (
                <div key={i} className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-5">
                  <p className="font-['Space_Mono'] text-[8px] tracking-[0.3em] text-[#C8963E] uppercase mb-4">
                    Award {i + 1}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Name" value={a.name} onChange={(v) => setAward(i, { name: v })} />
                    <Field label="Subtitle" value={a.sub} onChange={(v) => setAward(i, { sub: v })} />
                    <Field label="Year" value={a.year} onChange={(v) => setAward(i, { year: v })} />
                    <Field label="Result" value={a.result} onChange={(v) => setAward(i, { result: v })} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>CTA</SectionDivider>
            <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6">
              <Field label="Heading (use \n for line break)" value={draft.studio.ctaHeading} onChange={(v) => setStudio({ ctaHeading: v })} rows={2} />
            </div>
          </section>
        </div>
      )}

      {/* Bottom save */}
      <div className="flex justify-end pt-2 pb-8">
        <button
          onClick={save}
          className="font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-6 py-3 hover:bg-[#F0EDE6] transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
