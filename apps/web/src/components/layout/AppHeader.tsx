import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  variant?: "landing" | "app";
}

export function AppHeader({ variant = "app" }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-[#c4c7c7] bg-[#f9f9fa] px-6">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-sans text-2xl font-bold tracking-tight text-black">
          PahamIn
        </Link>
        {variant === "landing" && (
          <nav className="flex items-center gap-6 font-mono text-xs text-[#5d5e66]">
            <span>Tentang</span>
            <span>Fitur</span>
          </nav>
        )}
      </div>
      {variant === "landing" ? (
        <Link
          to="/login"
          className="border border-[#c4c7c7] px-[17px] py-[9px] font-mono text-xs font-medium text-[#1a1c1d]"
        >
          Masuk
        </Link>
      ) : (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border border-[#c4c7c7] bg-white px-[9px] py-[5px]">
            <Search size={14} className="text-[#6b7280]" />
            <input
              placeholder="Search..."
              className="w-48 font-mono text-sm text-[#1a1c1d] placeholder:text-[#6b7280] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full border border-[#c4c7c7] bg-[#e2e2e3]" />
            <span className="font-mono text-xs text-[#1a1c1d]">Budi Guru</span>
          </div>
          <Link to="/" className="font-mono text-xs text-[#5d5e66]">
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}
