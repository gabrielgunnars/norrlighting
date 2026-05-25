import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useData, type TeamMember } from "../data/store";
import agustPhoto from "../../imports/Screenshot_2026-05-09_at_11.50.22.png";
import kristrunPhoto from "../../imports/ChatGPT_Image_May_9__2026__12_11_02_PM.png";
import eygloPhoto from "../../imports/Screenshot_2026-05-09_at_12.04.53.png";
import karlPhoto from "../../imports/Screenshot_2026-05-09_at_12.04.06.png";
import olofPhoto from "../../imports/Screenshot_2026-05-09_at_12.06.22.png";

const DEFAULT_PHOTOS: Record<string, string> = {
  "seed-agust": agustPhoto as string,
  "seed-kristrun": kristrunPhoto as string,
  "seed-eyglo": eygloPhoto as string,
  "seed-karl": karlPhoto as string,
  "seed-olof": olofPhoto as string,
};

const values = [
  {
    num: "01",
    title: "Direct collaboration",
    desc: "You work with the same person from first meeting to final handover. No account managers, no handoffs — just close, clear communication throughout.",
  },
  {
    num: "02",
    title: "Inspired by Icelandic light",
    desc: "The contrasts of Iceland — extreme darkness and endless daylight, raw volcanic nature and quiet Nordic architecture — continue to shape how we think about atmosphere and experience.",
  },
  {
    num: "03",
    title: "Built from the ground up",
    desc: "Our founder trained as an electrician before becoming a lighting designer. We understand the systems, the limitations, and what actually works in the field.",
  },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const photo = member.photo ?? DEFAULT_PHOTOS[member.id] ?? null;
  return (
    <div className={`reveal delay-${(index % 3) * 100 + 100} group`}>
      <div className="relative overflow-hidden aspect-[3/4] bg-[#111] mb-6">
        {photo ? (
          <img
            src={photo}
            alt={member.name}
            className="w-full h-full object-cover object-top grayscale opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a18] flex items-center justify-center">
            <span className="font-['Libre_Bodoni'] italic text-4xl text-[#3a3a38]">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8963E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
      <div className="space-y-3 pt-1">
        <p className="font-['Inter'] font-[300] text-[9px] tracking-[0.3em] uppercase text-[#C8963E]">
          {member.role}
        </p>
        <h3 className="font-['Libre_Bodoni'] text-xl font-normal text-[#F0EDE6] leading-tight">
          {member.name}
        </h3>
        <p className="font-['Instrument_Sans'] text-[13px] font-light text-[#8a8478] leading-[1.8]" style={{ paddingTop: '0.5rem' }}>
          {member.bio}
        </p>
      </div>
    </div>
  );
}

export function Team() {
  const { team } = useData();
  useReveal();

  return (
    <>
      {/* Header */}
      <section className="relative border-b border-[rgba(240,237,230,0.06)] overflow-hidden" style={{ paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1762778233534-397d51ce1b62?w=1800&h=800&fit=crop&auto=format"
            alt="Studio interior"
            className="w-full h-full object-cover opacity-8"
            style={{ opacity: 0.08 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A09]/70 to-[#0A0A09]" />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto site-px">
          <div className="flex items-center gap-3 mb-8 reveal">
            <div className="w-6 bg-[#C8963E]" style={{ height: "1.5px" }} />
            <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
              The Studio
            </span>
          </div>
          <h1 className="font-['Libre_Bodoni'] italic text-[clamp(3.5rem,9vw,8rem)] leading-[0.92] font-normal text-[#F0EDE6] max-w-3xl reveal delay-100">
            The people behind the{" "}
            <span style={{ color: "#C8963E" }}>light.</span>
          </h1>
          <p className="mt-10 font-['Instrument_Sans'] text-sm font-light leading-[1.9] text-[#8a8478] max-w-lg reveal delay-200">
            A small, dedicated practice based in Reykjavík. We work as a close team, bringing individual expertise to every project we take on.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: '5rem 3.5rem' }}>
          {team.slice(0, 3).map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
        {team.length > 3 && (
          <div className="grid md:grid-cols-2 max-w-3xl mx-auto" style={{ gap: '5rem 3.5rem', marginTop: '5rem' }}>
            {team.slice(3).map((member, i) => (
              <MemberCard key={member.id} member={member} index={i + 3} />
            ))}
          </div>
        )}
      </section>

      {/* Values */}
      <section className="border-t border-[rgba(240,237,230,0.06)] bg-[#0d0d0c]">
        <div className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 reveal-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 bg-[#C8963E]" style={{ height: "1.5px" }} />
                <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
                  How we work
                </span>
              </div>
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2.5rem,4vw,3.5rem)] text-[#F0EDE6] font-normal leading-[0.95]">
                Small by choice
              </h2>
            </div>

            <div className="lg:col-span-8 reveal-right">
              {values.map((v, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-10 pb-10 mb-10 border-b border-[rgba(240,237,230,0.06)] last:border-0 last:mb-0 last:pb-0 delay-${(i + 1) * 100}`}
                >
                  <span className="font-['Space_Mono'] text-[9px] text-[#C8963E] mt-1 shrink-0 tracking-wider">
                    {v.num}
                  </span>
                  <div>
                    <h3 className="font-['Libre_Bodoni'] italic text-xl text-[#F0EDE6] font-normal mb-3 leading-tight">
                      {v.title}
                    </h3>
                    <p className="font-['Instrument_Sans'] text-sm font-light text-[#6a6460] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[rgba(240,237,230,0.06)]">
        <div className="max-w-screen-xl mx-auto site-px" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
          <div className="grid lg:grid-cols-12 items-end gap-12 reveal">
            <div className="lg:col-span-7">
              <h2 className="font-['Libre_Bodoni'] italic text-[clamp(2.5rem,6vw,5.5rem)] text-[#F0EDE6] font-normal leading-[0.93]">
                Work with us on<br />
                something lasting.
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
