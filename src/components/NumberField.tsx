"use client";

import React from "react";

type AnyForm = Record<string, unknown>;

type NumberFieldProps<TForm extends AnyForm> = {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  name: keyof TForm;                 // e.g. "adults" | "kids5to10"
  label: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export default function NumberField<TForm extends AnyForm>({
  form,
  setForm,
  name,
  label,
  min = 0,
  max,
  step = 1,
  placeholder = "0",
  required = false,
  className = "",
}: NumberFieldProps<TForm>) {
  // pull value as number | undefined (anything else becomes undefined)
  const raw = form[name];
  const value =
    typeof raw === "number" && Number.isFinite(raw) ? (raw as number) : undefined;

  const setValue = (next: number | undefined) =>
    setForm(prev => ({ ...prev, [name]: next }));

  return (
    <div className="mb-4">
      <label
        htmlFor={String(name)}
        className="block text-sm font-medium text-black"
      >
        {label}
      </label>
      <input
        id={String(name)}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        {...(max !== undefined ? { max } : {})}
        step={step}
        placeholder={placeholder}
        value={value ?? ""} // empty until user types
        onChange={(e) => {
          const v = e.target.value.trim();
          setValue(v === "" ? undefined : Number(v));
        }}
        required={required}
        autoComplete="off"
        className={`mt-1 block w-full rounded-md border-gray-300 text-black placeholder-gray-400
                    focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
      />
    </div>
  );
}