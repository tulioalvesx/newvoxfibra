import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className = "", ...props }: Props) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm font-semibold text-white/85">{label}</div> : null}
      <input
        className={[
          "w-full rounded-2xl border bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40",
          "border-white/10 focus:border-newvox-400/60 focus:outline-none focus:ring-2 focus:ring-newvox-400/30",
          error ? "border-red-400/60 focus:ring-red-400/20" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-2 text-sm text-red-300">{error}</div>
      ) : hint ? (
        <div className="mt-2 text-sm text-white/55">{hint}</div>
      ) : null}
    </label>
  );
}
