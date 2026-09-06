import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-20 sm:hidden">
      <div className="flex items-center justify-between bg-white/70 backdrop-blur-md px-4 py-3">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src="/horizontal_logo.png" alt="KelasIn" className="h-7" />
        </Link>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-md border border-[#c6c5d2]/60 text-[#001456]"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-b border-[#c6c5d2]/40 bg-white px-4 py-3">
          <a
            href="#tentang"
            onClick={() => setOpen(false)}
            className="border-b border-[#c6c5d2]/30 py-3 text-base font-bold text-[#454650]"
          >
            Tentang
          </a>
          <a
            href="#fitur"
            onClick={() => setOpen(false)}
            className="border-b border-[#c6c5d2]/30 py-3 text-base font-bold text-[#454650]"
          >
            Fitur
          </a>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-md bg-[#001456] py-3 text-center text-base font-semibold text-white"
          >
            Masuk
          </Link>
        </nav>
      )}
    </div>
  );
}
