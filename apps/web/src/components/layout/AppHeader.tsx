import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getCurrentUser, isAuthenticated, logout } from "@/lib/api/auth";
import type { UserResponse } from "@/types/api";

interface AppHeaderProps {
  variant?: "landing" | "app";
}

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

export function AppHeader({ variant = "app" }: AppHeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (variant !== "app" || !isAuthenticated()) return;
    let cancelled = false;
    getCurrentUser()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        // Stale/invalid token — client.ts already clears it on 401; header just stays blank.
      });
    return () => {
      cancelled = true;
    };
  }, [variant]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src="/horizontal_logo.png" alt="KelasIn" className="h-8" />
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
              {user ? initialsOf(user.full_name) : "?"}
            </div>
            <span className="font-mono text-xs text-foreground">{user?.full_name ?? "Guru"}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="font-mono text-xs text-red-700 transition-colors hover:text-foreground"
          >
            Keluar Akun
          </button>
        </div>
      )}
    </header>
  );
}
