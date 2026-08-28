import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dashed";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-neutral-800",
  secondary: "bg-white text-[#1a1c1d] border border-[#c4c7c7] hover:bg-[#f9f9fa]",
  ghost: "bg-transparent text-[#1a1c1d] hover:bg-[#f3f3f4]",
  dashed: "bg-transparent text-[#444748] border border-dashed border-[#747878] hover:bg-[#f9f9fa]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-6 py-3 text-xs",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-mono font-medium tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
