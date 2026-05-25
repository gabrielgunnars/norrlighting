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

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const { getCoverImage } = useData();
  const [hovered, setHovered] = useState(false);
  const cover = getCoverImage(p);

  return (
    <Link
      to={`/projects/${p.slug}`}
      className={`reveal delay-${(index + 1) * 100} relative overflow-hidden cursor-pointer group block`}
      style={{ aspectRatio: "3/4" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={cover}
        alt={p.name}
        className={`w-full h-full object-cover transition-transform duration-[1000ms] ease-out ${hovered ? "scale-[1.06]" : "scale-100"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/85 via-transparent to-transparent" />

      <div className="absolute top-4 left-4">
        <span className="font-['Inter'] font-[200] text-[8px] tracking-[0.3em] uppercase text-[#a09880]">
          {p.location}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-['Space_Mono'] text-[8px] tracking-[0.25em] uppercase text-[#C8963E] mb-2">
          {p.category} · {p.year}
        </p>
        <h3 className="font-['Libre_Bodoni'] italic text-lg font-normal text-[#F0EDE6] leading-tight">
          {p.name}
        </h3>
      </div>

      <div
        className={`absolute top-4 right-4 w-7 h-7 border border-[#C8963E]/50 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <ArrowUpRight size={11} className="text-[#C8963E]" />
      </div>
    </Link>
  );
}

function FeaturedProjects() {
  const { projects, siteConfig } = useData();

  const featured = siteConfig.featuredProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));

  // Fallback: show first 3 projects if nothing is configured
  const display = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section id="projects" className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: "10rem", paddingBottom: "10rem" }}>
      <div className="flex items-center justify-between mb-16 reveal">
        <div className="flex items-center gap-3">
          <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
          <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
            Selected Work
          </span>
        </div>
        <Link
          to="/projects"
          className="hidden sm:inline-flex items-center gap-1.5 font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#6a6460] hover:text-[#F0EDE6] transition-colors"
        >
          All projects <ArrowUpRight size={10} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {display.map((p, i) => (
          <ProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>
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

  return (
    <section className="border-t border-b border-[rgba(240,237,230,0.06)]">
      <div className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <p className="font-['Space_Mono'] text-[8px] tracking-[0.35em] text-[#C8963E] uppercase mb-8">
          Recognition
        </p>
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${Math.min(awards.length, 4)}, 1fr)` }}
        >
          {awards.map((award, i) => (
            <div
              key={award.id}
              className="reveal flex flex-col justify-between py-2"
              style={{
                paddingLeft: i === 0 ? 0 : "2rem",
                paddingRight: i === awards.length - 1 ? 0 : "2rem",
                borderLeft: i === 0 ? "none" : "1px solid rgba(240,237,230,0.07)",
                transitionDelay: `${i * 60}ms`,
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
