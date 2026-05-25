import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, FolderOpen, Users, LogOut, Menu, X, Home, FileText, Trophy } from "lucide-react";

const SESSION_KEY = "norr_admin_auth";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Projects", to: "/admin/projects", icon: FolderOpen },
  { label: "Team", to: "/admin/team", icon: Users },
  { label: "Homepage", to: "/admin/home", icon: Home },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Awards", to: "/admin/awards", icon: Trophy },
];

function SidebarContent({
  isActive,
  logout,
  onNav,
}: {
  isActive: (to: string) => boolean;
  logout: () => void;
  onNav?: () => void;
}) {
  return (
    <>
      <div className="px-7 border-b border-[rgba(240,237,230,0.06)] shrink-0" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Link to="/" className="flex items-center gap-3">
          <span className="font-['Libre_Bodoni'] text-xl tracking-[0.08em] text-[#F0EDE6] uppercase leading-none">
            NORR
          </span>
          <span className="w-px h-4 bg-[#C8963E]" />
          <span className="font-['Inter'] font-[100] text-[8px] tracking-[0.5em] text-[#a09880] uppercase">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto" style={{ padding: '1.75rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNav}
                className={`flex items-center gap-3 font-['Instrument_Sans'] text-sm transition-colors duration-150 rounded-sm ${
                  active
                    ? "text-[#C8963E] bg-[rgba(200,150,62,0.08)]"
                    : "text-[#5a5a58] hover:text-[#a09880] hover:bg-[rgba(240,237,230,0.03)]"
                }`}
                style={{ padding: '0.85rem 1rem' }}
              >
                <Icon size={15} className="shrink-0" />
                <span>{item.label}</span>
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-[#C8963E]" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[rgba(240,237,230,0.06)] shrink-0" style={{ padding: '1.25rem 1rem' }}>
        <Link
          to="/"
          onClick={onNav}
          className="flex items-center gap-3 text-[#5a5a58] hover:text-[#a09880] transition-colors font-['Instrument_Sans'] text-sm"
          style={{ padding: '0.75rem 1rem', marginBottom: '0.25rem' }}
        >
          <span className="text-[10px]">↗</span>
          View website
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full text-[#5a5a58] hover:text-red-400 transition-colors font-['Instrument_Sans'] text-sm"
          style={{ padding: '0.75rem 1rem' }}
        >
          <LogOut size={14} className="shrink-0" />
          Sign out
        </button>
      </div>
    </>
  );
}

export function AdminRoot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== "true") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/admin/login", { replace: true });
  };

  const isActive = (to: string) =>
    to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#0A0A09] flex">
      {/* Desktop sidebar — always in flex flow, no translate needed */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 admin-sidebar"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <SidebarContent isActive={isActive} logout={logout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className="lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-64 admin-sidebar"
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease" }}
      >
        <SidebarContent isActive={isActive} logout={logout} onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar — mobile only */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0A0A09]/95 backdrop-blur-xl border-b border-[rgba(240,237,230,0.06)] px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#6a6460] hover:text-[#F0EDE6] transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="font-['Libre_Bodoni'] text-sm tracking-[0.08em] text-[#F0EDE6] uppercase">NORR</span>
          <button
            onClick={logout}
            className="text-[#6a6460] hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </header>

        <main className="flex-1 w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
