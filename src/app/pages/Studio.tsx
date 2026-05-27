import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useData } from "../data/store";

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

function nl2br(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

function NumberedList({ items }: { items: Array<{ title: string; desc: string }> }) {
  return (
    <div className="border-t border-[rgba(240,237,230,0.08)]">
      {items.map((s, i) => (
        <div
          key={i}
          className="flex items-start gap-8 py-9 border-b border-[rgba(240,237,230,0.06)] group"
        >
          <span className="font-['Space_Mono'] text-[9px] text-[#C8963E] mt-1 shrink-0 tracking-wider w-6">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-['Instrument_Sans'] text-[15px] font-medium text-[#F0EDE6] mb-3 leading-snug">
              {s.title}
            </h3>
            <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-[1.85]">
              {s.desc}
            </p>
          </div>
          <ArrowUpRight size={13} className="text-[#C8963E]/50 shrink-0 mt-1 group-hover:text-[#C8963E] transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}

export function Studio() {
  useReveal();
  const { siteContent } = useData();
  const c = siteContent.studio;
  const processLines = c.processHeading.split('\n');
  const ctaLines = c.ctaHeading.split('\n');

  return (
    <>
      {/* Hero */}
      <section
        className="relative border-b border-[rgba(240,237,230,0.06)] overflow-hidden"
        style={{ paddingTop: "12rem", paddingBottom: "7rem" }}
      >
        <div className="relative z-10 max-w-screen-xl mx-auto site-px">
          <div className="flex items-center gap-3 mb-8 reveal">
            <div className="w-6 bg-[#C8963E]" style={{ height: "1.5px" }} />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
              The Studio
            </span>
          </div>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <h1 className="font-['Libre_Bodoni'] italic text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.92] font-normal text-[#F0EDE6] reveal">
                Studio
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex items-end reveal">
              <p className="font-['Instrument_Sans'] text-sm font-light leading-[1.9] text-[#6a6460]">
                {c.heroDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="border-b border-[rgba(240,237,230,0.06)]">
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 reveal-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
                <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                  About us
                </span>
              </div>
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2rem,3.5vw,3rem)] text-[#F0EDE6] font-normal leading-tight">
                {nl2br(c.aboutHeading)}
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 reveal-right space-y-6">
              <p className="font-['Instrument_Sans'] text-base font-light text-[#a09880] leading-[1.9]">
                {c.aboutP1}
              </p>
              <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-[1.9]">
                {c.aboutP2}
              </p>
              <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-[1.9]">
                {c.aboutP3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From concept to atmosphere */}
      <section id="process" className="border-b border-[rgba(240,237,230,0.06)] bg-[#0d0d0c]">
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 reveal-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
                <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                  Our Process
                </span>
              </div>
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2rem,3.5vw,3rem)] text-[#F0EDE6] font-normal leading-tight">
                {processLines[0]}<br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #C8963E, #E8B96A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {processLines.slice(1).join('\n')}
                </span>
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 reveal-right">
              <NumberedList items={c.processSteps} />
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines / Where we work */}
      <section id="disciplines" className="border-b border-[rgba(240,237,230,0.06)]">
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 reveal-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
                <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                  Disciplines
                </span>
              </div>
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2rem,3.5vw,3rem)] text-[#F0EDE6] font-normal leading-tight">
                Where we<br />work.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 reveal-right">
              <NumberedList items={c.disciplines} />
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="border-b border-[rgba(240,237,230,0.06)] bg-[#0d0d0c]">
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="flex items-center gap-3 mb-14 reveal">
            <div className="w-5 bg-[#C8963E]" style={{ height: "1.5px" }} />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
              Awards
            </span>
          </div>

          <div className="divide-y divide-[rgba(240,237,230,0.06)]">
            {c.awards.map((a, i) => (
              <div
                key={i}
                className="reveal flex items-center gap-6 py-5"
              >
                {/* Year */}
                <span className="font-['Space_Mono'] text-[10px] text-[#3a3a38] w-8 shrink-0">
                  {a.year}
                </span>

                {/* Name + sub */}
                <div className="flex-1 min-w-0">
                  <p className="font-['Instrument_Sans'] text-[15px] font-light text-[#F0EDE6] leading-snug">
                    {a.name}
                  </p>
                  {a.sub && (
                    <p className="font-['Space_Mono'] text-[9px] tracking-[0.2em] uppercase text-[#4a4a48] mt-1">
                      {a.sub}
                    </p>
                  )}
                </div>

                {/* Result badge */}
                <span
                  className={`font-['Space_Mono'] text-[9px] tracking-[0.25em] uppercase shrink-0 px-3 py-1.5 border ${
                    a.result === "Winner"
                      ? "text-[#C8963E] border-[#C8963E]/30 bg-[rgba(200,150,62,0.06)]"
                      : a.result === "Finalist"
                      ? "text-[#a09880] border-[rgba(240,237,230,0.12)] bg-[rgba(240,237,230,0.03)]"
                      : "text-[#6a6460] border-[rgba(240,237,230,0.08)] bg-transparent"
                  }`}
                >
                  {a.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div
          className="max-w-screen-xl mx-auto site-px"
          style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
        >
          <div className="grid lg:grid-cols-12 items-end gap-10 reveal">
            <div className="lg:col-span-7">
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2.5rem,6vw,5.5rem)] text-[#F0EDE6] font-normal leading-[0.93]">
                {ctaLines[0]}<br />{ctaLines.slice(1).join('\n')}
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <a
                href="mailto:info@norrlighting.is"
                className="inline-flex items-center gap-3 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] px-8 py-4 hover:bg-[#F0EDE6] transition-colors duration-300"
              >
                Get in touch <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
