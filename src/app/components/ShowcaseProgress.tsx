import type { Project } from "../data/store";

interface Props {
  projects: Project[];
  currentIndex: number;
  progress: number;
}

export function ShowcaseProgress({ projects, currentIndex, progress }: Props) {
  const fillPct = Math.min(100, Math.max(0, progress * 100));

  return (
    <div
      className="fixed z-[55] flex items-center gap-5"
      style={{ right: "clamp(1rem, 2.5vw, 2rem)", top: "50%", transform: "translateY(-50%)" }}
    >
      {/* Project names — desktop only */}
      <div className="hidden lg:flex flex-col gap-3 items-end">
        {projects.map((p, i) => (
          <span
            key={p.id}
            className="font-['Inter'] font-[200] uppercase text-right leading-relaxed transition-all duration-500"
            style={{
              fontSize: "7px",
              letterSpacing: "0.2em",
              maxWidth: "11rem",
              color: i === currentIndex ? "#F0EDE6" : "rgba(160,152,128,0.22)",
              transform: i === currentIndex ? "translateX(0)" : "translateX(4px)",
            }}
          >
            {p.name}
          </span>
        ))}
      </div>

      {/* Progress line */}
      <div
        className="relative"
        style={{ width: "1px", height: "clamp(160px, 35vh, 260px)" }}
      >
        {/* Track */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(160,152,128,0.15)" }}
        />

        {/* Fill */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            background: "linear-gradient(to bottom, #E0B060, #C8963E)",
            height: `${fillPct}%`,
          }}
        />

        {/* Dot */}
        <div
          className="absolute left-1/2 rounded-full"
          style={{
            width: "5px",
            height: "5px",
            background: "#C8963E",
            transform: "translateX(-50%)",
            top: `calc(${fillPct}% - 2.5px)`,
            boxShadow: "0 0 8px rgba(200,150,62,0.7)",
          }}
        />
      </div>
    </div>
  );
}
