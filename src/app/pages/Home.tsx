import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
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
        className={`relative z-10 max-w-[1600px] mx-auto site-px w-full transition-all duration-[1200ms] ease-out delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
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

      </div>
    </section>
  );
}

function ProjectOverlay({ p, large }: { p: Project; large?: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/80 via-[#0A0A09]/10 to-transparent" />
      <div className={`absolute ${large ? "top-7 left-8" : "top-5 left-6"}`}>
        <span className="font-['Instrument_Sans'] text-[8px] tracking-[0.3em] uppercase text-white/60">
          {p.category}
        </span>
      </div>
      <div className={`absolute ${large ? "bottom-10 left-8 right-8" : "bottom-6 left-6 right-6"}`}>
        <h3 className={`font-['Libre_Bodoni'] italic font-normal text-white leading-tight mb-2 ${large ? "text-4xl lg:text-5xl" : "text-2xl"}`}>
          {p.name}
        </h3>
        <p className="font-['Instrument_Sans'] text-[8px] tracking-[0.25em] uppercase text-white/50">
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
          <div className="max-w-[1600px] mx-auto site-px">
            <div className="flex items-end justify-between mb-10 reveal">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
                  <span className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
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
        className="max-w-[1600px] mx-auto site-px"
        style={{ paddingTop: "10rem", paddingBottom: "10rem" }}
      >
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 reveal-left">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
              <span className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
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
                <span className="font-['Instrument_Sans'] text-[8px] text-[#C8963E] mt-1 shrink-0">
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

  return (
    <section className="border-t border-b border-[rgba(240,237,230,0.06)]">
      <div className="max-w-[1600px] mx-auto site-px" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <p className="font-['Instrument_Sans'] text-[11px] tracking-[0.25em] text-[#C8963E] uppercase mb-10">
          Recognition
        </p>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          className="divide-x divide-[rgba(240,237,230,0.07)]"
          style={{ display: "grid", gridTemplateColumns: `repeat(${awards.length}, minmax(140px, 1fr))`, minWidth: "600px" }}
        >
          {awards.map((award, i) => (
            <div
              key={award.id}
              className="reveal flex flex-col justify-between"
              style={{
                paddingLeft: i === 0 ? 0 : "2rem",
                paddingRight: i === awards.length - 1 ? 0 : "2rem",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div>
                <p className="font-['Instrument_Sans'] text-xs font-light tracking-[0.15em] uppercase text-[#5a5a58] mb-4 truncate">
                  {award.name}
                </p>
                <h3 className="font-['Libre_Bodoni'] italic text-[clamp(1.4rem,2vw,2.2rem)] text-[#F0EDE6] font-normal leading-tight">
                  {award.result || "Winner"}
                </h3>
                {award.subtext && (
                  <p className="font-['Instrument_Sans'] text-xs font-light tracking-[0.12em] uppercase text-[#9a9488] mt-2">
                    {award.subtext}
                  </p>
                )}
              </div>
              <div className="w-6 bg-[#C8963E] mt-5" style={{ height: "1.5px" }} />
            </div>
          ))}
        </div>
        </div>
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
        className="max-w-[1600px] mx-auto site-px"
        style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
      >
        <div className="flex items-center gap-3 mb-10 reveal">
          <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
          <span className="font-['Instrument_Sans'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
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

function StudioTeaser() {
  return (
    <section className="border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-[1600px] mx-auto site-px" style={{ paddingTop: "7rem", paddingBottom: "7rem" }}>
        <div className="flex items-center gap-3 mb-10 reveal">
          <div className="w-5 bg-[#C8963E] shrink-0" style={{ height: "1.5px" }} />
          <span className="font-['Instrument_Sans'] text-[11px] tracking-[0.25em] text-[#C8963E] uppercase">
            The Practice
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start reveal">
          <p className="font-['Libre_Bodoni'] italic text-[clamp(1.3rem,2vw,1.9rem)] text-[#F0EDE6] font-normal leading-[1.6]">
            "A deliberate small practice. We take on a limited number of commissions each year so that every project receives the full attention of the team that designed it."
          </p>
          <div className="flex flex-col gap-5 lg:pt-2">
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#a09880] leading-[1.9]">
              Based in Reykjavík. Working internationally. Founded on the belief that the best lighting is the kind you feel without noticing.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 font-['Instrument_Sans'] text-sm text-[#F0EDE6] group w-fit"
            >
              <span className="border-b border-[#C8963E]/50 pb-0.5 group-hover:border-[#C8963E] transition-colors duration-300">
                About the studio
              </span>
              <ArrowUpRight size={13} className="text-[#C8963E]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { siteContent } = useData();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !message.trim()) return;
    const subject = `Project Inquiry${projectType ? ` — ${projectType}` : ""}`;
    const body = `Name: ${name}\nProject type: ${projectType || "—"}\n\n${message}`;
    window.location.href = `mailto:info@norrlighting.is?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="border-t border-[rgba(240,237,230,0.06)]">
      <div className="max-w-[1600px] mx-auto site-px" style={{ paddingTop: "9rem", paddingBottom: "9rem" }}>
        <div className="grid lg:grid-cols-12 gap-16 reveal">
          {/* Heading */}
          <div className="lg:col-span-5">
            <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2rem,3.5vw,3.8rem)] text-[#F0EDE6] font-normal leading-[1.05] mb-6">
              {siteContent.home.ctaLine1}
              <br />
              <span style={{ background: "linear-gradient(135deg,#C8963E,#E8B96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {siteContent.home.ctaLine2}
              </span>
            </h2>
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-[1.9] max-w-sm">
              {siteContent.home.ctaBody}
            </p>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-['Instrument_Sans'] text-[10px] tracking-[0.2em] uppercase text-[#5a5a58] mb-2">Name</label>
                <input
                  className="w-full bg-transparent border border-[rgba(240,237,230,0.1)] text-[#F0EDE6] font-['Instrument_Sans'] text-sm font-light px-4 py-3 outline-none focus:border-[#C8963E] transition-colors placeholder:text-[#3a3a38]"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-['Instrument_Sans'] text-[10px] tracking-[0.2em] uppercase text-[#5a5a58] mb-2">Project type</label>
                <select
                  className="w-full bg-[#0A0A09] border border-[rgba(240,237,230,0.1)] text-[#F0EDE6] font-['Instrument_Sans'] text-sm font-light px-4 py-3 outline-none focus:border-[#C8963E] transition-colors cursor-pointer"
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  <option value="">Select…</option>
                  <option value="Extreme Environments">Extreme Environments</option>
                  <option value="Commercial & Hospitality">Commercial &amp; Hospitality</option>
                  <option value="Residential">Residential</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-['Instrument_Sans'] text-[10px] tracking-[0.2em] uppercase text-[#5a5a58] mb-2">Message</label>
              <textarea
                className="w-full bg-transparent border border-[rgba(240,237,230,0.1)] text-[#F0EDE6] font-['Instrument_Sans'] text-sm font-light px-4 py-3 outline-none focus:border-[#C8963E] transition-colors placeholder:text-[#3a3a38] resize-none"
                rows={5}
                placeholder="Tell us about your project…"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              <button
                type="submit"
                className="inline-flex items-center gap-3 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-7 py-3.5 hover:bg-[#F0EDE6] transition-colors duration-300"
              >
                {sent ? "Opening email…" : "Send enquiry"}
                <ArrowUpRight size={14} />
              </button>
              <span className="font-['Instrument_Sans'] text-xs text-[#3a3a38]">
                or <a href="mailto:info@norrlighting.is" className="text-[#5a5a58] hover:text-[#a09880] transition-colors">info@norrlighting.is</a>
              </span>
            </div>
          </form>
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
      <StudioTeaser />
      <Services />
      <CTA />
    </>
  );
}
