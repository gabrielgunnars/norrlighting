import { Link } from "react-router";
import { useData, type Project } from "../data/store";

function ProjectCard({
  project,
  textSize = "large",
  style,
}: {
  project: Project;
  textSize?: "large" | "small";
  style?: React.CSSProperties;
}) {
  const { getCoverImage } = useData();

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="relative overflow-hidden group block"
      style={style}
    >
      <img
        src={getCoverImage(project)}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div
        className="absolute bottom-0 left-0"
        style={{
          padding:
            textSize === "large"
              ? "clamp(1.8rem, 4vw, 3.5rem)"
              : "clamp(1.4rem, 3vw, 2.5rem)",
        }}
      >
        <p className="font-['Space_Mono'] text-[8px] tracking-[0.35em] uppercase text-[#C8963E] mb-3">
          {project.category}
        </p>
        <h2
          className="font-['Libre_Bodoni'] italic font-normal text-white leading-[0.9]"
          style={{
            fontSize:
              textSize === "large"
                ? "clamp(2rem, 3.5vw, 3.8rem)"
                : "clamp(1.4rem, 2.2vw, 2.5rem)",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          {project.name}
        </h2>
        {project.location && (
          <p className="font-['Instrument_Sans'] text-[9px] tracking-[0.3em] uppercase text-[#a09880] mt-3">
            {project.location.split(",").pop()?.trim()}
          </p>
        )}
      </div>
    </Link>
  );
}

export function Projects() {
  const { projects } = useData();

  if (projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-['Instrument_Sans'] text-sm text-[#5a5a58]">
          No projects yet.{" "}
          <a href="/admin/projects/new" className="text-[#C8963E] hover:underline">
            Add your first
          </a>
        </p>
      </div>
    );
  }

  // Chunk into groups of 3
  const groups: Project[][] = [];
  for (let i = 0; i < projects.length; i += 3) {
    groups.push(projects.slice(i, i + 3));
  }

  return (
    <>
      {/* Header */}
      <div
        className="max-w-screen-xl mx-auto site-px"
        style={{ paddingTop: "9rem", paddingBottom: "2.5rem" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 bg-[#C8963E]" style={{ height: "1.5px" }} />
          <span className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase">
            Selected Work
          </span>
        </div>
      </div>

      {/* Editorial grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", background: "#0A0A09" }}>
        {groups.map((group, gi) => {
          const [p1, p2, p3] = group;
          const flip = gi % 2 === 1;

          if (group.length === 1) {
            return (
              <ProjectCard
                key={p1.id}
                project={p1}
                style={{ height: "60vh" }}
                textSize="large"
              />
            );
          }

          if (group.length === 2) {
            return (
              <div
                key={gi}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3px",
                  height: "55vh",
                }}
              >
                <ProjectCard project={p1} textSize="small" />
                <ProjectCard project={p2} textSize="small" />
              </div>
            );
          }

          // Alternating asymmetric layout: large left / large right
          return (
            <div
              key={gi}
              style={{
                display: "grid",
                gridTemplateColumns: flip ? "43fr 57fr" : "57fr 43fr",
                gridTemplateRows: "1fr 1fr",
                gap: "3px",
                height: "85vh",
              }}
            >
              <ProjectCard
                project={p1}
                style={{ gridColumn: flip ? 2 : 1, gridRow: "1 / 3" }}
                textSize="large"
              />
              <ProjectCard
                project={p2}
                style={{ gridColumn: flip ? 1 : 2, gridRow: 1 }}
                textSize="small"
              />
              <ProjectCard
                project={p3}
                style={{ gridColumn: flip ? 1 : 2, gridRow: 2 }}
                textSize="small"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
