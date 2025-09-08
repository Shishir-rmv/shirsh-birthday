// src/components/InviteForm.tsx
"use client";

import React from "react";
import NumberField from "@/components/NumberField";

type Attendance = "Yes" | "No" | "Maybe";
type FoodPref = "Veg" | "Non-Veg" | "Mixed";

type RsvpForm = {
  name: string;
  phone?: string;
  attendance?: Attendance;
  adults?: number;
  kids5to10?: number;
  kidsUnder5?: number;
  foodPref?: FoodPref;
  vegCount?: number;
  nonvegCount?: number;
  allergens?: string;
  notes?: string;
};

type Errors = Partial<Record<keyof RsvpForm, string>>;

export default function InviteForm() {
  const [form, setForm] = React.useState<RsvpForm>({ name: "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState<{ type: "success" | "error"; msg: string } | null>(null);

  // auto-hide toast
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const attending = form.attendance === "Yes" || form.attendance === "Maybe";
  const notAttending = form.attendance === "No";
  const mixedMeals = form.foodPref === "Mixed";

  // keep counts sane when toggling options
  React.useEffect(() => {
    if (!attending) {
      // clear attending-only fields when switching to "No"
      setForm((prev) => ({
        ...prev,
        adults: undefined,
        kids5to10: undefined,
        kidsUnder5: undefined,
        foodPref: undefined,
        vegCount: undefined,
        nonvegCount: undefined,
        allergens: undefined,
      }));
    } else {
      // if not mixed, clear split counts
      if (!mixedMeals) {
        setForm((prev) => ({ ...prev, vegCount: undefined, nonvegCount: undefined }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.attendance, form.foodPref]);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name || !form.name.trim()) e.name = "Please enter your name.";
    if (!form.attendance) e.attendance = "Please select an option.";

    if (attending) {
      if (form.adults === undefined && form.kids5to10 === undefined && form.kidsUnder5 === undefined) {
        e.adults = "Add at least one attendee.";
      }
      if (!form.foodPref) e.foodPref = "Choose a food preference.";
      if (mixedMeals) {
        const v = form.vegCount ?? 0;
        const n = form.nonvegCount ?? 0;
        if (v + n <= 0) e.vegCount = "Enter veg/non-veg count.";
        const total =
          (form.adults ?? 0) + (form.kids5to10 ?? 0) + (form.kidsUnder5 ?? 0);
        if (v + n > total) e.nonvegCount = "Veg + Non-veg exceeds guests.";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setToast(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || json?.ok !== true) {
        throw new Error(json?.error || "Submission failed");
      }

      setToast({
        type: "success",
        msg: notAttending
          ? "Thanks for letting us know. We’ll miss you!"
          : "Thank you! Your RSVP has been recorded 🎉",
      });

      // Optionally reset only some fields
      setForm((prev) => ({ name: prev.name || "", phone: prev.phone || "" } as RsvpForm));
      setErrors({});
    } catch (err: any) {
      setToast({ type: "error", msg: err?.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl">
        {/* Info note about RSVP importance */}
        <div className="mb-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 px-4 py-3">
          <p className="text-sm">
            <strong>Why RSVP?</strong> It helps us plan seating and food accurately so everyone’s
            comfortable. Please respond even if you{" "}
            <span className="underline underline-offset-2">can’t make it</span>. Thank you!
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <div
            role="status"
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            {toast.msg}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 md:p-10"
        >
          {/* Name */}
          <label htmlFor="name" className="block text-sm font-medium text-black">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-describedby={errors.name ? "err-name" : undefined}
            className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400
                       focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p id="err-name" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}

          {/* Phone (optional) */}
          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-black">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="e.g., 98765 43210"
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400
                         focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Attendance */}
          <fieldset className="mt-6">
            <legend className="block text-sm font-medium text-black">Will you attend?</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Yes", "No", "Maybe"] as Attendance[]).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-center rounded-lg border px-3 py-2 cursor-pointer
                    ${
                      form.attendance === opt
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 bg-white"
                    }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={opt}
                    checked={form.attendance === opt}
                    onChange={() => setForm({ ...form, attendance: opt })}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.attendance && (
              <p className="mt-1 text-xs text-red-600">{errors.attendance}</p>
            )}
          </fieldset>

          {/* If NOT attending: show a simple note and stop */}
          {notAttending && (
            <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
              Thanks for telling us. No other details needed.
            </div>
          )}

          {/* Attending fields */}
          {attending && (
            <>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NumberField form={form} setForm={setForm} name="adults" label="Adults" />
                <NumberField form={form} setForm={setForm} name="kids5to10" label="Kids (5–10)" />
                <NumberField
                  form={form}
                  setForm={setForm}
                  name="kidsUnder5"
                  label="Kids (&lt;5)"
                />
              </div>
              {errors.adults && (
                <p className="mt-1 text-xs text-red-600">{errors.adults}</p>
              )}

              {/* Food preference */}
              <fieldset className="mt-6">
                <legend className="block text-sm font-medium text-black">
                  Food preference
                </legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["Veg", "Non-Veg", "Mixed"] as FoodPref[]).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center justify-center rounded-lg border px-3 py-2 cursor-pointer
                    ${
                      form.foodPref === opt
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 bg-white"
                    }`}
                    >
                      <input
                        type="radio"
                        name="foodPref"
                        value={opt}
                        checked={form.foodPref === opt}
                        onChange={() => setForm({ ...form, foodPref: opt })}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.foodPref && (
                  <p className="mt-1 text-xs text-red-600">{errors.foodPref}</p>
                )}
              </fieldset>

              {/* Veg / Non-veg split for Mixed */}
              {mixedMeals && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <NumberField
                      form={form}
                      setForm={setForm}
                      name="vegCount"
                      label="Veg meals"
                    />
                    <NumberField
                      form={form}
                      setForm={setForm}
                      name="nonvegCount"
                      label="Non-Veg meals"
                    />
                  </div>
                  {(errors.vegCount || errors.nonvegCount) && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.vegCount || errors.nonvegCount}
                    </p>
                  )}
                </>
              )}

              {/* Allergens / Notes */}
              <div className="mt-6">
                <label htmlFor="allergens" className="block text-sm font-medium text-black">
                  Allergens (optional)
                </label>
                <input
                  id="allergens"
                  type="text"
                  placeholder="e.g., peanuts, gluten"
                  value={form.allergens ?? ""}
                  onChange={(e) => setForm({ ...form, allergens: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400
                             focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-black">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Anything we should know?"
                  value={form.notes ?? ""}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400
                             focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium text-white shadow
            ${submitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {submitting ? "Sending..." : "Send RSVP"}
          </button>
        </form>
      </div>
    </section>
  );
}
