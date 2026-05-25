import { Link } from "react-router";
import { FolderOpen, Users, Home, ArrowUpRight } from "lucide-react";
import { useData } from "../../data/store";

const quickLinks = [
  { label: "Projects", to: "/admin/projects", icon: FolderOpen, desc: "Create, edit, and delete portfolio projects" },
  { label: "Team", to: "/admin/team", icon: Users, desc: "Manage team member profiles" },
  { label: "Homepage", to: "/admin/home", icon: Home, desc: "Hero image, featured projects, Instagram grid" },
];

export function AdminDashboard() {
  const { projects } = useData();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const recent = [...projects]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
      <div>
        <p className="font-['Space_Mono'] text-[9px] tracking-[0.35em] text-[#C8963E] uppercase mb-3">
          Overview
        </p>
        <h1 className="font-['Libre_Bodoni'] italic text-3xl text-[#F0EDE6] font-normal">
          {greeting}
        </h1>
        <p className="font-['Instrument_Sans'] text-sm font-light text-[#5a5a58] mt-1.5">
          Norrlighting admin panel ·{" "}
          <span className="text-[#a09880]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      {/* Quick links */}
      <div>
        <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#5a5a58] mb-4">
          Manage
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-start gap-5 p-7 bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] hover:border-[rgba(200,150,62,0.3)] transition-colors group"
              >
                <div className="w-8 h-8 bg-[rgba(200,150,62,0.08)] flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[#C8963E]" />
                </div>
                <div className="min-w-0">
                  <p className="font-['Instrument_Sans'] text-sm text-[#F0EDE6] group-hover:text-[#C8963E] transition-colors">
                    {link.label}
                  </p>
                  <p className="font-['Instrument_Sans'] text-xs font-light text-[#5a5a58] mt-0.5 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
                <ArrowUpRight
                  size={13}
                  className="text-[#3a3a38] group-hover:text-[#C8963E] transition-colors shrink-0 ml-auto mt-0.5"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#5a5a58]">
            Portfolio
          </p>
          <Link
            to="/admin/projects"
            className="font-['Inter'] font-[200] text-[9px] tracking-[0.25em] uppercase text-[#C8963E] hover:text-[#E0B060] transition-colors flex items-center gap-1"
          >
            Manage <ArrowUpRight size={9} />
          </Link>
        </div>
        <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.06)] divide-y divide-[rgba(240,237,230,0.04)]">
          {recent.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="font-['Instrument_Sans'] text-sm font-light text-[#4a4a48]">
                No projects yet
              </p>
            </div>
          ) : (
            recent.map((p) => (
              <Link
                key={p.id}
                to={`/admin/projects/${p.id}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-[rgba(240,237,230,0.02)] transition-colors"
              >
                <div>
                  <p className="font-['Instrument_Sans'] text-sm text-[#F0EDE6] font-light">
                    {p.name}
                  </p>
                  <p className="font-['Inter'] font-[200] text-[9px] tracking-[0.2em] uppercase text-[#5a5a58] mt-0.5">
                    {[p.category, p.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="font-['Space_Mono'] text-[8px] tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5">
                  Published
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
