import { useState, useRef, useEffect } from "react";
import { Upload, RotateCcw, Check } from "lucide-react";

const STORAGE_KEY = "norr_hero_image";

export function AdminImages() {
  const [heroSrc, setHeroSrc] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHeroSrc(stored);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      localStorage.setItem(STORAGE_KEY, result);
      setHeroSrc(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHeroSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
          Media
        </p>
        <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
          Images
        </h1>
        <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
          Update the homepage hero image
        </p>
      </div>

      <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-['Instrument_Sans'] text-sm text-[#F0EDE6]">Hero Image</p>
            <p className="font-['Instrument_Sans'] text-xs font-light text-[#5a5a58] mt-0.5">
              Displayed on the homepage background
            </p>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 font-['Instrument_Sans'] text-[8px] tracking-wider text-green-400">
              <Check size={10} /> Saved
            </span>
          )}
        </div>

        {/* Preview */}
        <div
          className="w-full bg-[#111110] border border-[rgba(240,237,230,0.06)] overflow-hidden mb-5"
          style={{ aspectRatio: "16/7" }}
        >
          {heroSrc ? (
            <img src={heroSrc} alt="Hero preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-['Instrument_Sans'] text-xs text-[#3a3a38]">
                Default image (from codebase)
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="hero-upload"
          />
          <label
            htmlFor="hero-upload"
            className="flex items-center gap-2 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-5 py-2.5 hover:bg-[#E0B060] transition-colors cursor-pointer"
          >
            <Upload size={13} />
            Upload image
          </label>
          {heroSrc && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 font-['Instrument_Sans'] text-sm border border-[rgba(240,237,230,0.1)] text-[#6a6460] px-5 py-2.5 hover:text-[#F0EDE6] hover:border-[rgba(240,237,230,0.2)] transition-colors"
            >
              <RotateCcw size={12} />
              Reset to default
            </button>
          )}
        </div>

        <p className="font-['Instrument_Sans'] text-xs font-light text-[#3a3a38] mt-4 leading-relaxed">
          Recommended: landscape image, minimum 1920×1080px. The image is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
