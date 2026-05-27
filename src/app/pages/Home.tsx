import { useState, useEffect } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import defaultHero from "../../imports/ChatGPT_Image_May_9__2026__12_30_21_PM.png";
import { useData, type Project } from "../data/store";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Hero() {
  const { siteConfig, siteContent } = useData();
  const c = siteContent.home;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const heroSrc = siteConfig.heroImage ?? (defaultHero as string);
  const heroVideo = siteConfig.heroVideo ?? null;

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        {heroVideo ? (
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-[2000ms] ease-out ${loaded ? "opacity-55" : "opacity-0"}`}
          />
        ) : (
          <img
            src={heroSrc}
            alt="Illuminated cave interior"
            className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${loaded ? "opacity-55 scale-100" : "opacity-0 scale-[1.04]"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/20 to-transparent" />
      </div>

      <div
        style={{ paddingBottom: "10rem" }}
        className={`relative z-10 max-w-screen-xl mx-auto site-px w-full transition-all duration-[1200ms] ease-out delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1
              className="font-['Libre_Bodoni'] italic text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.93] font-normal text-white"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.7)" }}
            >
              {c.heroLine1}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #C8963E, #E8B96A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {c.heroLine2}
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-2 space-y-6">
            <p className="font-['Instrument_Sans'] text-sm font-light leading-[1.9] text-[#a09880] max-w-xs">
              {c.heroSubtext}
            </p>
            <a
              href="#projects"
              className="inline-flex items-center gap-2.5 font-['Instrument_Sans'] text-sm text-[#F0EDE6] group"
            >
              <span className="border-b border-[#C8963E]/50 pb-0.5 group-hover:border-[#C8963E] transition-colors duration-300">
                View our work
              </span>
              <ArrowUpRight size={14} className="text-[#C8963E]" />
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 opacity-30">
          <ChevronDown size={13} className="text-[#a09880] animate-bounce" />
          <span className="font-['Space_Mono'] text-[8px] tracking-[0.4em] text-[#6a6460] uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectOverlay({ p, large }: { p: Project; large?: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/80 via-[#0A0A09]/10 to-transparent" />
      <div className={`absolute ${large ? "top-7 left-8" : "top-5 left-6"}`}>
        <span className="font-['Space_Mono'] text-[8px] tracking-[0.3em] uppercase text-white/60">
          {p.category}
        </span>
      </div>
      <div className={`absolute ${large ? "bottom-10 left-8 right-8" : "bottom-6 left-6 right-6"}`}>
        <h3 className={`font-['Libre_Bodoni'] italic font-normal text-white leading-tight mb-2 ${large ? "text-4xl lg:text-5xl" : "text-2xl"}`}>
          {p.name}
        </h3>
        <p className="font-['Space_Mono'] text-[8px] tracking-[0.25em] uppercase text-white/50">
          {p.location}
        </p>
      </div>
    </>
  );
}

function CategoryGrid({ display, flip }: { display: Project[]; flip?: boolean }) {
  const { getCoverImage } = useData();
  const [hovered, setHovered] = useState<number | null>(null);
  const [p0, p1, p2] = display;

  // flip=false: big image LEFT, stacked RIGHT
  // flip=true:  stacked LEFT, big image RIGHT
  const bigCol = flip ? "2" : "1";
  const bigColSpan = flip
    ? { gridColumn: "2", gridRow: "1 / 3" }
    : { gridColumn: "1", gridRow: "1 / 3" };
  const small1 = flip ? { gridColumn: "1", gridRow: "1" } : { gridColumn: "2", gridRow: "1" };
  const small2 = flip ? { gridColumn: "1", gridRow: "2" } : { gridColumn: "2", gridRow: "2" };

  const cols = flip ? "1fr 1.35fr" : "1.35fr 1fr";

  return (
    <>
      {/* Desktop grid */}
      <div
        className="hidden md:grid reveal"
        style={{ gridTemplateColumns: cols, gridTemplateRows: "1fr 1fr", height: "88vh" }}
      >
        {p0 && (
          <Link
            to={`/projects/${p0.slug}`}
            className="relative overflow-hidden group"
            style={bigColSpan}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={getCoverImage(p0)}
              alt={p0.name}
              className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${hovered === 0 ? "scale-[1.04]" : "scale-100"}`}
            />
            <ProjectOverlay p={p0} large />
          </Link>
        )}
        {p1 && (
          <Link
            to={`/projects/${p1.slug}`}
            className="relative overflow-hidden group"
            style={small1}
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={getCoverImage(p1)}
              alt={p1.name}
              className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${hovered === 1 ? "scale-[1.04]" : "scale-100"}`}
            />
            <ProjectOverlay p={p1} />
          </Link>
        )}
        {p2 && (
          <Link
            to={`/projects/${p2.slug}`}
            className="relative overflow-hidden group"
            style={small2}
            onMouseEnter={() => setHovered(2)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={getCoverImage(p2)}
              alt={p2.name}
              className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out ${hovered === 2 ? "scale-[1.04]" : "scale-100"}`}
            />
            <ProjectOverlay p={p2} />
          </Link>
        )}
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden flex flex-col reveal">
        {display.map((p, i) => (
          <Link
            key={p.id}
            to={`/projects/${p.slug}`}
            className="relative overflow-hidden group"
            style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}
          >
            <img src={getCoverImage(p)} alt={p.name} className="w-full h-full object-cover" />
            <ProjectOverlay p={p} large={i === 0} />
          </Link>
        ))}
      </div>
    </>
  );
}

const CATEGORIES = [
  { key: "extreme",     label: "Extreme Environments",      configKey: "featuredExtremeIds"      as const },
  { key: "hospitality", label: "Commercial & Hospitality",  configKey: "featuredHospitalityIds"  as const },
  { key: "residential", label: "Residential",               configKey: "featuredResidentialIds"  as const },
] as const;

function FeaturedProjects() {
  const { projects, siteConfig } = useData();

  const sections = CATEGORIES.map(({ key, label, configKey }, sectionIdx) => {
    const ids: string[] = siteConfig[configKey] ?? [];
    const pinned = ids.map((id) => projects.find((p) => p.id === id)).filter((p): p is Project => Boolean(p));
    // fallback: first 3 from this category
    const fallback = projects.filter((p) => {
      if (key === "extreme") return p.category === "Extreme Environments";
      if (key === "hospitality") return p.category === "Commercial & Hospitality";
      return p.category === "Residential";
    }).slice(0, 3);
    const display = pinned.length > 0 ? pinned : fallback;
    return { key, label, display, flip: sectionIdx % 2 === 1 };
  }).filter(({ display }) => display.length > 0);

  if (sections.length === 0) return null;

  return (
    <section id="projects" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
      {sections.map(({ key, label, display, flip }, i) => (
        <div key={key} style={{ marginBottom: i < sections.length - 1 ? "6rem" : 0 }}>
          {/* Section header */}
          <div className="max-w-screen-xl mx-auto site-px">
            <div className="flex items-end justify-between mb-10 reveal">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
                  <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                    Selected Work
                  </span>
                </div>
                <h2 className="font-['Libre_Bodoni'] italic text-[clamp(1.6rem,2.8vw,2.6rem)] font-normal text-[#F0EDE6]">
                  {label}
                </h2>
              </div>
              {i === 0 && (
                <Link
                  to="/projects"
                  className="hidden sm:inline-flex items-center gap-1.5 font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#6a6460] hover:text-[#F0EDE6] transition-colors mb-1"
                >
                  All projects <ArrowUpRight size={10} />
                </Link>
              )}
            </div>
          </div>

          {/* Full-bleed grid */}
          <CategoryGrid display={display} flip={flip} />
        </div>
      ))}
    </section>
  );
}

function Services() {
  const { siteContent } = useData();
  const items = siteContent.home.services.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));

  return (
    <section className="border-t border-[rgba(240,237,230,0.06)]">
      <div
        className="max-w-screen-xl mx-auto site-px"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 reveal-left">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
              <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                Disciplines
              </span>
            </div>
            <h2 className="font-['Libre_Bodoni'] italic text-[clamp(1.8rem,3vw,2.6rem)] text-[#F0EDE6] font-normal leading-tight">
              Where we work
            </h2>
          </div>

          <div className="lg:col-span-8 reveal-right">
            {items.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-10 py-10 border-b border-[rgba(240,237,230,0.06)] last:border-0 delay-${(i + 1) * 100}`}
              >
                <span className="font-['Space_Mono'] text-[8px] text-[#C8963E] mt-1 shrink-0">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-['Instrument_Sans'] text-sm font-medium text-[#F0EDE6] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AwardsSection() {
  const { awards } = useData();
  if (awards.length === 0) return null;

  // Split into rows of max 4
  const rows: typeof awards[] = [];
  for (let i = 0; i < awards.length; i += 4) {
    rows.push(awards.slice(i, i + 4));
  }

  return (
    <section className="border-t border-b border-[rgba(240,237,230,0.06)]">
      <div className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <p className="font-['Space_Mono'] text-[8px] tracking-[0.35em] text-[#C8963E] uppercase mb-10">
          Recognition
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {rows.map((row, rowIdx) => {
            const isLast = rowIdx === rows.length - 1;
            const centered = isLast && row.length < 4;
            return (
              <div
                key={rowIdx}
                className={`flex ${centered ? "justify-center" : ""}`}
                style={{
                  borderTop: rowIdx > 0 ? "1px solid rgba(240,237,230,0.06)" : "none",
                  paddingTop: rowIdx > 0 ? "2.5rem" : 0,
                  marginTop: rowIdx > 0 ? "2.5rem" : 0,
                }}
              >
                {row.map((award, i) => (
                  <div
                    key={award.id}
                    className="reveal flex flex-col justify-between"
                    style={{
                      flex: centered ? "0 0 25%" : "1",
                      maxWidth: "25%",
                      paddingLeft: i === 0 ? 0 : "2rem",
                      paddingRight: i === row.length - 1 ? 0 : "2rem",
                      borderLeft: i === 0 ? "none" : "1px solid rgba(240,237,230,0.07)",
                      transitionDelay: `${(rowIdx * 4 + i) * 60}ms`,
                    }}
                  >
                    <div>
                      <p className="font-['Space_Mono'] text-[8px] tracking-[0.3em] uppercase text-[#4a4a48] mb-4 leading-relaxed">
                        {award.name}
                      </p>
                      <h3 className="font-['Libre_Bodoni'] italic text-[clamp(1.4rem,2.2vw,2.2rem)] text-[#F0EDE6] font-normal leading-[1.05]">
                        {award.result || "Winner"}
                      </h3>
                      {award.subtext && (
                        <p className="font-['Space_Mono'] text-[8px] tracking-[0.25em] uppercase text-[#4a4a48] mt-3 leading-relaxed">
                          {award.subtext}
                        </p>
                      )}
                    </div>
                    <div className="w-6 bg-[#C8963E] mt-6" style={{ height: "1.5px" }} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <p className="font-['Instrument_Sans'] text-sm font-light text-[#4a4a48] mt-10 text-center leading-relaxed">
          Internationally recognized for atmospheric lighting in Icelandic nature and architectural environments.
        </p>
      </div>
    </section>
  );
}

function InstagramGrid() {
  const { siteConfig } = useData();
  const images = siteConfig.instagramImages.filter(Boolean);
  if (images.length === 0) return null;

  return (
    <section className="border-t border-[rgba(240,237,230,0.06)]">
      <div
        className="max-w-screen-xl mx-auto site-px"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <div className="flex items-center gap-3 mb-10 reveal">
          <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
          <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
            Studio
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {images.slice(0, 6).map((src, i) => (
            <div
              key={i}
              className="reveal overflow-hidden aspect-square group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { siteContent } = useData();
  return (
    <section id="contact" className="border-t border-[rgba(240,237,230,0.06)]">
      <div
        className="max-w-screen-xl mx-auto site-px"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <div className="grid lg:grid-cols-12 items-end gap-10 reveal">
          <div className="lg:col-span-8">
            <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2.5rem,6vw,6rem)] text-[#F0EDE6] font-normal leading-[0.93]">
              {siteContent.home.ctaLine1}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #C8963E, #E8B96A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {siteContent.home.ctaLine2}
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] mb-8 leading-[1.9]">
              {siteContent.home.ctaBody}
            </p>
            <a
              href="mailto:info@norrlighting.is"
              className="inline-flex items-center gap-3 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-7 py-4 hover:bg-[#F0EDE6] transition-colors duration-300"
            >
              Start a conversation <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  useReveal();
  return (
    <>
      <Hero />
      <AwardsSection />
      <FeaturedProjects />
      <Services />
      <InstagramGrid />
      <CTA />
    </>
  );
}
