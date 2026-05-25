import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", to: "/projects" },
  { label: "Team", to: "/team" },
  { label: "Studio", to: "/studio" },
];

export function Root() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-[#0A0A09] text-[#F0EDE6] min-h-screen overflow-x-hidden">
      {/* Cursor glow */}
      <div
        className="cursor-glow hidden lg:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-[#0A0A09]/98 backdrop-blur-xl border-b border-[rgba(240,237,230,0.1)]"
            : "bg-gradient-to-b from-[#0A0A09]/70 to-transparent"
        }`}
      >
        <div className="max-w-screen-xl mx-auto site-px flex items-center justify-between h-20 lg:h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            <span className="font-['Libre_Bodoni'] font-normal text-[1.8rem] lg:text-[2.2rem] tracking-[0.08em] text-white uppercase leading-none">
              NORR
            </span>
            <span
              className="w-px bg-[#C8963E] shrink-0 transition-all duration-500"
              style={{ height: "1.6rem" }}
            />
            <span className="font-['Inter'] font-[100] text-[10px] tracking-[0.55em] text-[#a09880] uppercase">
              Lighting
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative font-['Inter'] font-[300] text-[11px] tracking-[0.28em] uppercase text-[#b8b2a8] hover:text-[#F0EDE6] transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8963E] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <a
            href="mailto:info@norrlighting.is"
            className="relative hidden lg:inline-flex items-center font-['Inter'] font-[300] text-[11px] tracking-[0.28em] uppercase text-[#b8b2a8] hover:text-[#F0EDE6] transition-colors duration-300 group"
          >
            Inquire
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8963E] group-hover:w-full transition-all duration-300" />
          </a>

          <button
            className="lg:hidden text-[#F0EDE6] p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[#0d0d0c] border-t border-[rgba(240,237,230,0.06)] px-10 py-8 flex flex-col gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="font-['Inter'] font-[200] text-[12px] tracking-[0.35em] uppercase text-[#a09880] hover:text-[#F0EDE6] transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:info@norrlighting.is"
              className="inline-flex items-center gap-2 font-['Inter'] font-[200] text-[11px] tracking-[0.3em] uppercase text-[#C8963E] border border-[#C8963E]/40 px-5 py-3 w-fit mt-2"
            >
              Inquire <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="border-t border-[rgba(240,237,230,0.05)] bg-[#0d0d0c]">
        <div className="max-w-screen-xl mx-auto site-px py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-['Libre_Bodoni'] text-base tracking-[0.08em] text-[#4a4a48] uppercase">NORR</span>
            <span className="w-px h-3 bg-[#C8963E]/40" />
            <span className="font-['Space_Mono'] text-[7px] tracking-[0.2em] text-[#2e2e2c] uppercase">© 2026 Norrlighting ehf. · Reykjavík</span>
          </div>
          <a href="mailto:info@norrlighting.is" className="font-['Instrument_Sans'] text-[11px] font-light text-[#3a3a38] hover:text-[#6a6460] transition-colors">
            info@norrlighting.is
          </a>
        </div>
      </footer>
    </div>
  );
}
