import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-newvox-400/60";
  const styles: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-newvox-200 via-newvox-500 to-newvox-600 text-white shadow-[0_18px_60px_rgba(7,217,254,0.25)] hover:brightness-110",
    secondary:
      "bg-white/10 text-white border border-white/15 hover:bg-white/15",
    ghost:
      "bg-transparent text-white/85 hover:bg-white/10 border border-white/10",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
