import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  variant?: "landing" | "app";
}

export function AppHeader({ variant = "app" }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-sans text-2xl font-bold tracking-tight text-foreground">
          PahamIn
        </Link>
        {variant === "landing" && (
          <nav className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
            <span className="cursor-pointer transition-colors hover:text-foreground">Tentang</span>
            <span className="cursor-pointer transition-colors hover:text-foreground">Fitur</span>
          </nav>
        )}
      </div>
      {variant === "landing" ? (
        <Link to="/login">
          <Button variant="secondary" size="sm">
            Masuk
          </Button>
        </Link>
      ) : (
        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5">
            <Search size={14} className="text-muted-foreground" />
            <input
              placeholder="Search..."
              className="w-48 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div> */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary font-mono text-xs font-medium text-muted-foreground">
              BG
            </div>
            <span className="font-mono text-xs text-foreground">Budi Guru</span>
          </div>
          <Link to="/" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            Logout
          </Link>
        </div>
      )}
    </header>
  );
}
