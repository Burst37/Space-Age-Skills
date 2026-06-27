"use client";

import type { ReactNode } from "react";

const labelCls = "mb-2 block text-[0.66rem] uppercase tracking-wide2 text-cream/50";
const controlCls =
  "w-full border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 outline-none transition-colors focus:border-gold/70";

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      <input
        className={controlCls}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      <select className={`${controlCls} appearance-none`} name={name} required={required} defaultValue="">
        <option value="" disabled>
          Select
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-soft-black">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextareaField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea className={`${controlCls} min-h-[110px] resize-y`} name={name} placeholder={placeholder} />
    </label>
  );
}

export function FormShell({
  children,
  onSubmit,
  status,
  successTitle,
  successBody,
}: {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: "idle" | "submitting" | "success" | "error";
  successTitle: string;
  successBody: string;
}) {
  if (status === "success") {
    return (
      <div className="atmosphere relative flex min-h-[320px] flex-col items-center justify-center border border-gold/25 bg-black/40 p-10 text-center">
        <span className="display text-6xl text-gold">{"✓"}</span>
        <h3 className="display mt-4 text-3xl text-cream">{successTitle}</h3>
        <p className="mt-3 max-w-sm text-sm text-cream/55">{successBody}</p>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="atmosphere relative border border-gold/20 bg-black/40 p-7 sm:p-9">
      {children}
      {status === "error" && (
        <p className="mt-4 text-sm text-gold">
          Something went wrong sending that. Call us at the booking line and we will sort it.
        </p>
      )}
    </form>
  );
}
