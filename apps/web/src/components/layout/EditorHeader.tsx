import { ArrowLeft } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <Link
          to={backTo}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-sans text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="font-mono text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
