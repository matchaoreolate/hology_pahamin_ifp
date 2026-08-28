import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-[#c4c7c7] bg-[#eeeeef] px-[9px] py-[3px] font-mono text-[11px] text-[#5d5e66]">
      {children}
    </span>
  );
}
