import { BookOpen, FileText, MonitorPlay } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { getProject } from "@/lib/api/projects";
import { cn } from "@/lib/utils";
import type { ApiOutputType } from "@/types/api";

const OUTPUT_TABS: { type: ApiOutputType; label: string; icon: typeof MonitorPlay }[] = [
  { type: "presentation", label: "Presentasi", icon: MonitorPlay },
  { type: "lkpd", label: "LKPD", icon: FileText },
  { type: "ebook", label: "E-book", icon: BookOpen },
];

/** Fixed segmented control for switching between a project's generated outputs. */
export function OutputSwitcher({ projectId }: { projectId: string }) {
  const location = useLocation();
  const [availableOutputs, setAvailableOutputs] = useState<ApiOutputType[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProject(projectId)
      .then((project) => {
        if (!cancelled) setAvailableOutputs(project.selected_outputs);
      })
      .catch(() => {
        // Fall back to showing every tab if the project can't be fetched.
        if (!cancelled) setAvailableOutputs(null);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const tabs = OUTPUT_TABS.filter(
    (tab) => !availableOutputs || availableOutputs.includes(tab.type),
  );
  if (tabs.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xs">
      {tabs.map(({ type, label, icon: Icon }) => {
        const isActive = location.pathname.endsWith(`/${type}`);
        return (
          <Link
            key={type}
            to={`/projects/${projectId}/${type}`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide uppercase transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={13} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
