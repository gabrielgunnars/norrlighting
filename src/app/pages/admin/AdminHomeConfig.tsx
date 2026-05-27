import { useRef, useState, useCallback } from "react";
import { compressImage } from "../../utils/imageUtils";
import { uploadFile } from "../../lib/storage";
import { Upload, X, Check, Film, Loader2 } from "lucide-react";
import { useData } from "../../data/store";
import defaultHero from "../../../imports/ChatGPT_Image_May_9__2026__12_30_21_PM.png";

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

export function AdminHomeConfig() {
  const { projects, siteConfig, updateSiteConfig, getCoverImage } = useData();
  const [flashSaved, setFlashSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const heroRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [heroDragOver, setHeroDragOver] = useState(false);
  const [videoDragOver, setVideoDragOver] = useState(false);

  const showSaved = () => {
    setFlashSaved(true);
    setTimeout(() => setFlashSaved(false), 2500);
  };

  const withSaving = async (fn: () => Promise<void>) => {
    setSaving(true);
    try {
      await fn();
      showSaved();
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  // ── Hero image ─────────────────────────────────────────────────────────
  const handleHeroFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    await withSaving(async () => {
      const src = await compressImage(file);
      await updateSiteConfig({ heroImage: src, heroVideo: null });
    });
    if (heroRef.current) heroRef.current.value = "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSiteConfig]);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleHeroFile(file);
  };

  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHeroDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleHeroFile(file);
  };

  const resetHero = async () => {
    await withSaving(async () => {
      await updateSiteConfig({ heroImage: null, heroVideo: null });
    });
    if (heroRef.current) heroRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  };

  // ── Hero video ─────────────────────────────────────────────────────────
  // Video is uploaded directly to Supabase Storage (too large for base64)
  const handleVideoFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) return;
    await withSaving(async () => {
      const ext = file.name.split(".").pop() ?? "mp4";
      const url = await uploadFile(file, `config/hero-${Date.now()}.${ext}`);
      await updateSiteConfig({ heroVideo: url, heroImage: null });
    });
    if (videoRef.current) videoRef.current.value = "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSiteConfig]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setVideoDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleVideoFile(file);
  };

  // ── Featured projects (per category) ──────────────────────────────────
  const FEATURED_CATEGORIES = [
    { label: "Extreme Environments",     idKey: "featuredExtremeIds"      as const, filter: "Extreme Environments" },
    { label: "Commercial & Hospitality", idKey: "featuredHospitalityIds"  as const, filter: "Commercial & Hospitality" },
    { label: "Residential",              idKey: "featuredResidentialIds"  as const, filter: "Residential" },
  ] as const;

  const setFeaturedSlot = async (
    idKey: "featuredExtremeIds" | "featuredHospitalityIds" | "featuredResidentialIds",
    slot: number,
    projectId: string
  ) => {
    const current: string[] = Array.from({ length: 3 }, (_, i) => (siteConfig[idKey] ?? [])[i] ?? "");
    const next = [...current];
    next[slot] = projectId;
    await withSaving(async () => {
      await updateSiteConfig({ [idKey]: next.filter(Boolean) });
    });
  };

  // ── Instagram grid ─────────────────────────────────────────────────────
  const igImages: string[] = Array.from(
    { length: 6 },
    (_, i) => siteConfig.instagramImages[i] ?? ""
  );

  const handleIgUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await withSaving(async () => {
      const src = await compressImage(file);
      const next = [...igImages];
      next[idx] = src;
      await updateSiteConfig({ instagramImages: next });
    });
  };

  const removeIg = async (idx: number) => {
    const next = [...igImages];
    next[idx] = "";
    await withSaving(async () => {
      await updateSiteConfig({ instagramImages: next });
    });
  };

  return (
    <div style={{ maxWidth: "48rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
            Homepage
          </p>
          <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
            Homepage Config
          </h1>
          <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
            Hero image, featured projects, and Instagram grid
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {saving && <Loader2 size={12} className="text-[#C8963E] animate-spin" />}
          {flashSaved && !saving && (
            <span className="flex items-center gap-1.5 font-['Instrument_Sans'] text-[8px] tracking-wider text-green-400">
              <Check size={10} /> Saved
            </span>
          )}
        </div>
      </div>

      {/* ── Hero Image / Video ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SectionDivider>Hero — Image or Video</SectionDivider>
        <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6">
          {/* Preview */}
          <div className="w-full bg-[#111110] overflow-hidden mb-5" style={{ aspectRatio: "16/7" }}>
            {siteConfig.heroVideo ? (
              <video src={siteConfig.heroVideo} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            ) : (
              <img
                src={siteConfig.heroImage ?? (defaultHero as string)}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Image drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setHeroDragOver(true); }}
            onDragLeave={() => setHeroDragOver(false)}
            onDrop={handleHeroDrop}
            onClick={() => heroRef.current?.click()}
            className={`border border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors mb-3 ${
              heroDragOver
                ? "border-[#C8963E]/60 bg-[rgba(200,150,62,0.04)]"
                : "border-[rgba(240,237,230,0.1)] hover:border-[#C8963E]/40"
            }`}
            style={{ padding: "1.25rem" }}
          >
            <Upload size={14} className="text-[#4a4a48] shrink-0" />
            <span className="font-['Instrument_Sans'] text-sm text-[#5a5a58]">
              Drop an image or <span className="text-[#C8963E]">browse</span>
            </span>
            <span className="font-['Instrument_Sans'] text-[8px] tracking-wider text-[#3a3a38] ml-auto">JPG · PNG · WEBP</span>
            <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
          </div>

          {/* Video drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
            onDragLeave={() => setVideoDragOver(false)}
            onDrop={handleVideoDrop}
            onClick={() => videoRef.current?.click()}
            className={`border border-dashed flex items-center justify-center gap-3 cursor-pointer transition-colors ${
              videoDragOver
                ? "border-[#C8963E]/60 bg-[rgba(200,150,62,0.04)]"
                : "border-[rgba(240,237,230,0.1)] hover:border-[#C8963E]/40"
            }`}
            style={{ padding: "1.25rem" }}
          >
            <Film size={14} className="text-[#4a4a48] shrink-0" />
            <span className="font-['Instrument_Sans'] text-sm text-[#5a5a58]">
              Drop a video or <span className="text-[#C8963E]">browse</span>
            </span>
            <span className="font-['Instrument_Sans'] text-[8px] tracking-wider text-[#3a3a38] ml-auto">MP4 · WEBM · MOV</span>
            <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} />
          </div>

          {(siteConfig.heroImage || siteConfig.heroVideo) && (
            <button
              onClick={resetHero}
              className="mt-4 flex items-center gap-2 font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-5 py-2.5 hover:text-[#F0EDE6] hover:border-[rgba(240,237,230,0.2)] transition-colors"
            >
              <X size={12} />
              Reset to default
            </button>
          )}

          <p className="font-['Instrument_Sans'] text-xs font-light text-[#3a3a38] mt-4">
            Image: landscape, min 1920×1080px · Video: muted loop, under 50MB recommended
          </p>
        </div>
      </section>

      {/* ── Featured Projects (per category) ── */}
      {FEATURED_CATEGORIES.map((cat) => {
        const ids: string[] = Array.from(
          { length: 3 },
          (_, i) => (siteConfig[cat.idKey] ?? [])[i] ?? ""
        );
        const categoryProjects = projects.filter((p) => p.category === cat.filter);
        return (
          <section key={cat.idKey} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SectionDivider>Featured — {cat.label}</SectionDivider>
            <p className="font-['Instrument_Sans'] text-xs font-light text-[#5a5a58]">
              Up to 3 projects shown in the <span className="text-[#a09880]">{cat.label}</span> homepage section.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[0, 1, 2].map((slot) => {
                const selectedId = ids[slot];
                const selected = projects.find((p) => p.id === selectedId);
                return (
                  <div
                    key={slot}
                    className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-4 sm:p-5 flex items-center gap-3 sm:gap-5"
                  >
                    <div className="w-16 h-16 shrink-0 bg-[#111110] overflow-hidden">
                      {selected ? (
                        <img src={getCoverImage(selected)} alt={selected.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-['Instrument_Sans'] text-[10px] text-[#2a2a28]">{slot + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#4a4a48] mb-2">
                        Slot {slot + 1}
                      </p>
                      <select
                        className="admin-input"
                        value={selectedId}
                        onChange={(e) => setFeaturedSlot(cat.idKey, slot, e.target.value)}
                        style={{ appearance: "none", cursor: "pointer" }}
                      >
                        <option value="">— None —</option>
                        {categoryProjects.length > 0
                          ? categoryProjects.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                          : projects.map((p) => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        }
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ── Instagram Grid ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SectionDivider>Instagram Grid</SectionDivider>
        <p className="font-['Instrument_Sans'] text-xs font-light text-[#5a5a58]">
          6 images shown at the bottom of the homepage. Square crops work best.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {igImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square bg-[#111110] border border-[rgba(240,237,230,0.06)] overflow-hidden group/ig"
            >
              {src ? (
                <>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#0A0A09]/75 opacity-0 group-hover/ig:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="flex items-center gap-1 font-['Instrument_Sans'] text-[10px] text-[#C8963E] border border-[#C8963E]/50 px-2.5 py-1.5 cursor-pointer hover:bg-[rgba(200,150,62,0.15)] transition-colors">
                      <Upload size={9} />
                      Replace
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIgUpload(idx, e)} />
                    </label>
                    <button
                      onClick={() => removeIg(idx)}
                      className="flex items-center gap-1 font-['Instrument_Sans'] text-[10px] text-red-400 border border-red-400/30 px-2.5 py-1.5 hover:bg-red-400/10 transition-colors"
                    >
                      <X size={9} />
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[rgba(240,237,230,0.02)] transition-colors">
                  <Upload size={16} className="text-[#3a3a38]" />
                  <span className="font-['Instrument_Sans'] text-[7px] tracking-wider text-[#3a3a38]">Image {idx + 1}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleIgUpload(idx, e)} />
                </label>
              )}
            </div>
          ))}
        </div>
        {igImages.every((s) => !s) && (
          <p className="font-['Instrument_Sans'] text-xs text-[#3a3a38]">
            No images uploaded yet — the Instagram section will be hidden on the homepage.
          </p>
        )}
      </section>
    </div>
  );
}
