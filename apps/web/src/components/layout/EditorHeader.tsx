import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EditorHeaderProps {
  backTo: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function EditorHeader({ backTo, title, subtitle, actions }: EditorHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-[#c4c7c7] bg-[#f9f9fa] px-6">
      <div className="flex items-center gap-4">
        <Link to={backTo} className="text-[#444748] hover:text-black">
          ←
        </Link>
        <div>
          <h1 className="font-sans text-xl font-semibold text-black">{title}</h1>
          {subtitle && (
            <p className="font-mono text-[11px] text-[#5d5e66]">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
