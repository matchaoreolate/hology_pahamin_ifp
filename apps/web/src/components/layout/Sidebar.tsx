import { FolderOpen, PlusCircle, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Pusat Materi", icon: FolderOpen },
  { to: "/projects/new", label: "Buat Materi", icon: PlusCircle },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 flex w-64 flex-col border-r border-border bg-secondary/40 px-3 py-4">
      <nav className="flex flex-1 flex-col gap-1 pt-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 font-mono text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button className="flex items-center justify-center gap-2 rounded-md border border-input bg-card px-4 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:bg-secondary">
        <Sparkles size={14} />
        Bantu Saya
      </button>
    </aside>
  );
}
