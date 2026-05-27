import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "../data/store";
import { ShowcaseProgress } from "../components/ShowcaseProgress";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// Scroll units → pixels.  Each "unit" represents one logical scroll step.
// ─────────────────────────────────────────────────────────────────────────────
const UNIT_DESKTOP = 720;
const UNIT_MOBILE = 480;

export function Showcase() {
  const { projects, getCoverImage } = useData();

  const [showHint, setShowHint] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const locationRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const nameRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exitOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  // [projectIndex][subImageIndex]
  const subImgRefs = useRef<(HTMLImageElement | null)[][]>([]);

  // ── Hide scroll hint on first scroll ────────────────────────────────────
  useEffect(() => {
    const handler = () => setShowHint(false);
    window.addEventListener("scroll", handler, { once: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── GSAP ScrollTrigger setup ─────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!projects.length) return;

    const mob = window.innerWidth < 768;
    const UNIT = mob ? UNIT_MOBILE : UNIT_DESKTOP;

    const ctx = gsap.context(() => {
      projects.forEach((project, i) => {
        const section = sectionRefs.current[i];
        const cover = coverImgRefs.current[i];
        const textWrapper = textWrapperRefs.current[i];
        const locationEl = locationRefs.current[i];
        const nameEl = nameRefs.current[i];
        const numberEl = numberRefs.current[i];
        const exitOverlay = exitOverlayRefs.current[i];
        const subs = (subImgRefs.current[i] ?? []).filter(
          (el): el is HTMLImageElement => el !== null
        );

        if (!section || !cover || !textWrapper || !nameEl) return;

        const numSubs = subs.length;
        // timeline units: entry(1) + parallax-hold(0.5) + subs(0.8×n) + exit(0.5)
        const totalUnits = 2.0 + numSubs * 0.8;

        // ── Set initial states ──────────────────────────────────────────
        gsap.set(cover, { opacity: 0, transformOrigin: "center center" });
        gsap.set(nameEl, { opacity: 0, yPercent: 22 });
        if (locationEl) gsap.set(locationEl, { opacity: 0 });
        if (numberEl) gsap.set(numberEl, { opacity: 0 });
        if (exitOverlay) gsap.set(exitOverlay, { opacity: 0 });
        subs.forEach((img) =>
          gsap.set(img, { opacity: 0, scale: 1, transformOrigin: "center center" })
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${Math.round(totalUnits * UNIT)}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            onEnter: () => setCurrentIndex(i),
            onEnterBack: () => setCurrentIndex(i),
          },
        });

        // ─ Phase 1 · Entry ─────────────────────────────────────────────
        tl.to(cover, { opacity: 1, duration: 0.55, ease: "power1.inOut" });
        tl.to(
          nameEl,
          { opacity: 1, yPercent: 0, duration: 0.45, ease: "power2.out" },
          "<+=0.15"
        );
        if (locationEl)
          tl.to(
            locationEl,
            { opacity: 1, duration: 0.35, ease: "power2.out" },
            "<"
          );

        // ─ Phase 2 · Parallax hold ─────────────────────────────────────
        tl.to(textWrapper, { opacity: 0, duration: 0.3, ease: "power2.in" });
        tl.to(
          cover,
          { yPercent: mob ? -3 : -8, duration: 0.5, ease: "none" },
          "<"
        );

        // ─ Phase 3 · Sub-images (cross-fade + Ken Burns) ───────────────
        subs.forEach((img) => {
          tl.to(img, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, ">");
          tl.to(img, { scale: 1.05, duration: 0.8, ease: "none" }, "<+=0.05");
        });

        // ─ Phase 4 · Exit ──────────────────────────────────────────────
        if (exitOverlay)
          tl.to(exitOverlay, { opacity: 1, duration: 0.3, ease: "power2.in" }, ">");
        if (numberEl)
          tl.to(numberEl, { opacity: 0.15, duration: 0.15 }, ">-=0.12");
      });

      // Global scroll progress for the indicator
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setProgress(self.progress),
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!projects.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['Instrument_Sans'] text-sm text-[#5a5a58]">
          No projects to showcase.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ background: "#0A0A09" }}>
      {/* ── Fixed progress indicator ──────────────────────────────────────── */}
      <ShowcaseProgress
        projects={projects}
        currentIndex={currentIndex}
        progress={progress}
      />

      {/* ── Scroll hint ───────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-10 left-1/2 z-[60] flex flex-col items-center gap-2.5 pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          opacity: showHint ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      >
        <span className="font-['Instrument_Sans'] text-[7px] tracking-[0.45em] uppercase text-[#4a4a48]">
          Scroll
        </span>
        <div
          className="relative overflow-hidden"
          style={{ width: "1px", height: "2.5rem" }}
        >
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#C8963E]/50 to-transparent"
            style={{
              height: "100%",
              animation: "scrollHintSlide 1.6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ── Project sections ─────────────────────────────────────────────── */}
      {projects.map((project, i) => {
        const coverSrc = getCoverImage(project);
        // Sub-images = all images except cover
        const subImages = project.images.filter(
          (_, idx) => idx !== project.coverIndex
        );
        const country =
          project.location.split(",").pop()?.trim() || project.location;
        const num = String(i + 1).padStart(2, "0");

        // Ensure per-project sub-image array exists before rendering
        if (!subImgRefs.current[i]) subImgRefs.current[i] = [];

        return (
          <div
            key={project.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
            className="relative overflow-hidden"
            style={{ height: "100vh", background: "#0A0A09" }}
          >
            {/* ── Cover image ── */}
            <img
              ref={(el) => { coverImgRefs.current[i] = el; }}
              src={coverSrc}
              alt={project.name}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                willChange: "transform, opacity",
                transformOrigin: "center center",
              }}
            />

            {/* ── Sub-images (stacked, start invisible) ── */}
            {subImages.map((src, j) => (
              <img
                key={j}
                ref={(el) => { subImgRefs.current[i][j] = el; }}
                src={src}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  willChange: "transform, opacity",
                  transformOrigin: "center center",
                }}
              />
            ))}

            {/* ── Radial edge vignette ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background:
                  "radial-gradient(ellipse at center, transparent 40%, #0A0A09 100%)",
              }}
            />

            {/* ── Bottom gradient (darkens lower third) ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 2,
                background:
                  "linear-gradient(to top, rgba(10,10,9,0.96) 0%, rgba(10,10,9,0.18) 38%, transparent 60%)",
              }}
            />

            {/* ── Text overlay ── */}
            <div
              ref={(el) => { textWrapperRefs.current[i] = el; }}
              className="absolute bottom-0 left-0"
              style={{ zIndex: 3, padding: "clamp(2rem, 5vw, 5rem)" }}
            >
              <p
                ref={(el) => { locationRefs.current[i] = el; }}
                className="font-['Inter'] font-[200] uppercase text-[#a09880] mb-4"
                style={{ fontSize: "10px", letterSpacing: "0.35em" }}
              >
                {country} · {project.category} · {project.year}
              </p>
              <h2
                ref={(el) => { nameRefs.current[i] = el; }}
                className="font-['Libre_Bodoni'] italic font-normal text-[#F0EDE6]"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 8rem)",
                  lineHeight: 0.93,
                  textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                }}
              >
                {project.name}
              </h2>
            </div>

            {/* ── Project number watermark ── */}
            <div
              ref={(el) => { numberRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <span
                className="font-['Instrument_Sans'] text-[#C8963E]"
                style={{ fontSize: "clamp(5rem, 12vw, 12rem)" }}
              >
                {num}
              </span>
            </div>

            {/* ── Exit black overlay ── */}
            <div
              ref={(el) => { exitOverlayRefs.current[i] = el; }}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 4, background: "#0A0A09" }}
            />
          </div>
        );
      })}

      {/* Inline keyframes for scroll hint animation */}
      <style>{`
        @keyframes scrollHintSlide {
          0%   { transform: translateY(-100%); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
