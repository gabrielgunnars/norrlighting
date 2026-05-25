import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useData, type Project } from "../data/store";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-[#0A0A09]/98 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 border border-[rgba(240,237,230,0.15)] flex items-center justify-center hover:border-[#C8963E]/60 transition-colors"
      >
        <X size={15} className="text-[#F0EDE6]" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-6 w-10 h-10 border border-[rgba(240,237,230,0.15)] flex items-center justify-center hover:border-[#C8963E]/60 transition-colors"
      >
        <ChevronLeft size={16} className="text-[#F0EDE6]" />
      </button>

      <img
        src={images[idx]}
        alt=""
        className="max-w-[85vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-6 w-10 h-10 border border-[rgba(240,237,230,0.15)] flex items-center justify-center hover:border-[#C8963E]/60 transition-colors"
      >
        <ChevronRight size={16} className="text-[#F0EDE6]" />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-8 bg-[#C8963E]" : "w-2 bg-[rgba(240,237,230,0.2)]"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-6 font-['Space_Mono'] text-[8px] tracking-widest text-[#4a4a48]">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

function HeroSlideshow({ project }: { project: Project }) {
  const images = project.images.length > 0 ? project.images : [];
  const [idx, setIdx] = useState(project.coverIndex ?? 0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "88vh" }}>
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: loaded && i === idx ? 0.8 : 0 }}
          />
        ))}
        {images.length === 0 && <div className="w-full h-full bg-[#111110]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/25 to-[#0A0A09]/50" />
      </div>

      {/* Back link — top */}
      <div className="absolute top-36 left-0 right-0 z-20 max-w-screen-xl mx-auto site-px">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-xs font-light text-[#8a8478] hover:text-[#F0EDE6] transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          All projects
        </Link>
      </div>

      {/* Bottom-left: title block */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 max-w-screen-xl mx-auto site-px w-full"
        style={{ paddingBottom: "5rem" }}
      >
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
              <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                {project.category}
              </span>
            </div>
            <h1
              className="font-['Libre_Bodoni'] italic text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.93] font-normal text-white"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}
            >
              {project.name}
            </h1>
          </div>

          {/* Bottom-right: location + slide counter */}
          <div className="text-right shrink-0 pb-1">
            <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.35em] uppercase text-[#6a6460] mb-1">
              {project.location}
            </p>
            {images.length > 1 && (
              <p className="font-['Space_Mono'] text-[8px] tracking-widest text-[#3a3a38]">
                {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Slideshow controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[rgba(240,237,230,0.15)] bg-[#0A0A09]/30 flex items-center justify-center hover:border-[#C8963E]/60 hover:bg-[#0A0A09]/60 transition-all"
          >
            <ChevronLeft size={16} className="text-[#F0EDE6]" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border border-[rgba(240,237,230,0.15)] bg-[#0A0A09]/30 flex items-center justify-center hover:border-[#C8963E]/60 hover:bg-[#0A0A09]/60 transition-all"
          >
            <ChevronRight size={16} className="text-[#F0EDE6]" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-px rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-[#C8963E]" : "w-2 bg-[rgba(240,237,230,0.2)]"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function GallerySection({
  images,
  projectName,
  onOpen,
}: {
  images: string[];
  projectName: string;
  onOpen: (i: number) => void;
}) {
  if (images.length === 0) return null;

  const [first, second, third, ...rest] = images;

  return (
    <section style={{ paddingBottom: "8rem" }}>
      <div className="max-w-screen-xl mx-auto site-px mb-10 reveal">
        <div className="flex items-center gap-3">
          <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
          <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
            Gallery
          </span>
          <span className="font-['Space_Mono'] text-[9px] tracking-[0.2em] text-[#3a3a38] ml-1">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto site-px">
        {/* Single image */}
        {images.length === 1 && (
          <div
            className="reveal overflow-hidden cursor-zoom-in"
            onClick={() => onOpen(0)}
            style={{ maxHeight: "75vh" }}
          >
            <img
              src={first}
              alt={projectName}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              style={{ maxHeight: "75vh" }}
            />
          </div>
        )}

        {/* Two images: 7/5 split */}
        {images.length === 2 && (
          <div className="grid grid-cols-12 gap-3">
            <div
              className="col-span-7 overflow-hidden cursor-zoom-in reveal"
              onClick={() => onOpen(0)}
              style={{ aspectRatio: "4/3" }}
            >
              <img src={first} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div
              className="col-span-5 overflow-hidden cursor-zoom-in reveal"
              onClick={() => onOpen(1)}
              style={{ aspectRatio: "4/3" }}
            >
              <img src={second} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" />
            </div>
          </div>
        )}

        {/* Three or more: editorial asymmetric grid */}
        {images.length >= 3 && (
          <>
            {/* Hero trio: large left + 2 stacked right */}
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "7fr 5fr",
                gridTemplateRows: "1fr 1fr",
                height: "72vh",
              }}
            >
              <div
                className="overflow-hidden cursor-zoom-in reveal"
                style={{ gridRow: "1 / 3" }}
                onClick={() => onOpen(0)}
              >
                <img src={first} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1000ms]" />
              </div>
              <div
                className="overflow-hidden cursor-zoom-in reveal"
                onClick={() => onOpen(1)}
              >
                <img src={second} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1000ms]" />
              </div>
              <div
                className="overflow-hidden cursor-zoom-in reveal"
                onClick={() => onOpen(2)}
              >
                <img src={third} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1000ms]" />
              </div>
            </div>

            {/* Remaining images: 3-column grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                {rest.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden cursor-zoom-in reveal"
                    onClick={() => onOpen(i + 3)}
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects, findBySlug } = useData();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useReveal();

  const project = findBySlug(slug ?? "");
  const allImages = project?.images ?? [];

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Instrument_Sans'] text-sm text-[#6a6460] mb-4">Project not found</p>
          <Link to="/projects" className="font-['Instrument_Sans'] text-sm text-[#C8963E] hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSlideshow project={project} />

      {/* Brief — editorial split layout */}
      <section
        className="max-w-screen-xl mx-auto site-px"
        style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Description */}
          <div className="lg:col-span-7 reveal-left space-y-6">
            <p className="font-['Instrument_Sans'] text-lg font-light text-[#a09880] leading-[1.85]">
              {project.description}
            </p>
            {project.details && (
              <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-[1.9]">
                {project.details}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="lg:col-span-4 lg:col-start-9 reveal-right">
            <div className="border-t border-[rgba(240,237,230,0.08)]">
              {[
                { label: "Category", value: project.category },
                { label: "Location", value: project.location },
              ].map(({ label, value }) =>
                value ? (
                  <div
                    key={label}
                    className="flex items-center justify-between py-5 border-b border-[rgba(240,237,230,0.05)]"
                  >
                    <span className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#3a3a38]">
                      {label}
                    </span>
                    <span className="font-['Instrument_Sans'] text-sm font-light text-[#a09880]">
                      {value}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection
        images={allImages}
        projectName={project.name}
        onOpen={setLightboxIdx}
      />

      {/* Editorial prev / next navigation */}
      <section className="border-t border-[rgba(240,237,230,0.06)]">
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
        >
          <div className="grid grid-cols-2 gap-8">
            {/* Previous */}
            <div>
              {prevProject ? (
                <Link to={`/projects/${prevProject.slug}`} className="group block">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowLeft size={11} className="text-[#4a4a48] group-hover:text-[#C8963E] transition-colors group-hover:-translate-x-0.5 duration-300" />
                    <span className="font-['Inter'] font-[200] text-[8px] tracking-[0.4em] uppercase text-[#4a4a48]">
                      Previous
                    </span>
                  </div>
                  <h3 className="font-['Libre_Bodoni'] italic text-[clamp(1.4rem,2.5vw,2.2rem)] text-[#5a5a58] group-hover:text-[#F0EDE6] transition-colors duration-300 leading-tight">
                    {prevProject.name}
                  </h3>
                  <p className="font-['Inter'] font-[200] text-[8px] tracking-[0.25em] uppercase text-[#3a3a38] mt-2">
                    {prevProject.location}
                  </p>
                </Link>
              ) : (
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm font-light text-[#4a4a48] hover:text-[#F0EDE6] transition-colors group"
                >
                  <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                  All projects
                </Link>
              )}
            </div>

            {/* Next */}
            <div className="text-right">
              {nextProject ? (
                <Link to={`/projects/${nextProject.slug}`} className="group block">
                  <div className="flex items-center justify-end gap-2 mb-4">
                    <span className="font-['Inter'] font-[200] text-[8px] tracking-[0.4em] uppercase text-[#4a4a48]">
                      Next
                    </span>
                    <ArrowRight size={11} className="text-[#4a4a48] group-hover:text-[#C8963E] transition-colors group-hover:translate-x-0.5 duration-300" />
                  </div>
                  <h3 className="font-['Libre_Bodoni'] italic text-[clamp(1.4rem,2.5vw,2.2rem)] text-[#5a5a58] group-hover:text-[#F0EDE6] transition-colors duration-300 leading-tight">
                    {nextProject.name}
                  </h3>
                  <p className="font-['Inter'] font-[200] text-[8px] tracking-[0.25em] uppercase text-[#3a3a38] mt-2">
                    {nextProject.location}
                  </p>
                </Link>
              ) : (
                <a
                  href="mailto:info@norrlighting.is"
                  className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm font-light text-[#C8963E] hover:text-[#E8C87A] transition-colors"
                >
                  Start a project <ArrowRight size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
