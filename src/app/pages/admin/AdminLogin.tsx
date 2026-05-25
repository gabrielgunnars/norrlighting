import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

const ADMIN_PASSWORD = "norr2026";
const SESSION_KEY = "norr_admin_auth";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "true");
        navigate("/admin", { replace: true });
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-15 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(200,150,62,0.3) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="font-['Libre_Bodoni'] font-normal text-[2.2rem] tracking-[0.08em] text-[#F0EDE6] uppercase leading-none">
              NORR
            </span>
            <span className="w-px h-7 bg-[#C8963E]" />
            <span className="font-['Inter'] font-[100] text-[10px] tracking-[0.55em] text-[#a09880] uppercase">
              Lighting
            </span>
          </div>
          <p className="font-['Space_Mono'] text-[9px] tracking-[0.4em] text-[#6a6460] uppercase mt-4">
            Admin portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d0c] border border-[rgba(240,237,230,0.07)] p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-7 h-7 border border-[#C8963E]/30 flex items-center justify-center">
              <Lock size={12} className="text-[#C8963E]" />
            </div>
            <div>
              <h1 className="font-['Instrument_Sans'] text-base font-medium text-[#F0EDE6]">
                Sign in
              </h1>
              <p className="font-['Inter'] font-[200] text-[10px] tracking-[0.2em] text-[#6a6460] uppercase mt-0.5">
                Restricted access
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-['Inter'] font-[200] text-[9px] tracking-[0.3em] uppercase text-[#6a6460] block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="admin-input pr-12"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a6460] hover:text-[#a09880] transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-['Instrument_Sans'] text-xs text-red-400 bg-red-400/5 border border-red-400/20 px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-3 font-['Instrument_Sans'] text-sm bg-[#C8963E] text-[#0A0A09] py-3.5 hover:bg-[#E0B060] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border border-[#0A0A09]/30 border-t-[#0A0A09] rounded-full animate-spin" />
              ) : (
                <>
                  Enter <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-['Inter'] font-[200] text-[9px] tracking-[0.2em] text-[#3a3a38] uppercase mt-8">
          © 2026 Norrlighting ehf.
        </p>
      </div>
    </div>
  );
}
