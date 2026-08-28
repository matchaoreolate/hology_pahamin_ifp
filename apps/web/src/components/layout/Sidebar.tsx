import { FolderOpen, PlusCircle, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Pusat Materi", icon: FolderOpen },
  { to: "/projects/new", label: "Buat Materi", icon: PlusCircle },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 flex w-64 flex-col border-r border-[#c4c7c7] bg-[#f3f3f4] px-4 py-4">
      <nav className="flex flex-1 flex-col gap-2 pt-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 font-mono text-xs ${
                isActive ? "bg-black text-white" : "text-[#5d5e66] hover:bg-[#e2e2e3]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button className="flex items-center justify-center gap-2 border border-[#c4c7c7] px-4 py-2 font-mono text-xs text-[#1a1c1d] hover:bg-white">
        <Sparkles size={14} />
        Bantu Saya
      </button>
    </aside>
  );
}
