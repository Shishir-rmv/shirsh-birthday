// src/components/InviteForm.tsx
"use client";

import React from "react";
import NumberField from "@/components/NumberField";

type Attendance = "Yes" | "No" | "Maybe";
type FoodPref = "Veg" | "Non-Veg";

type RsvpForm = {
  name: string;
  phone: string;
  attendance?: Attendance;
  adults?: number;
  kids5to10?: number;
  kidsUnder5?: number;
  foodPref?: FoodPref;
  allergens?: string;
  notes?: string;
};

type Errors = Partial<Record<keyof RsvpForm, string>> & {
  _submit?: string; // ✅ add explicit key for submit-level error
};

export default function InviteForm() {
  const [form, setForm] = React.useState<RsvpForm>({ name: "", phone: ""});
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  // persistent success page
  const [successData, setSuccessData] = React.useState<RsvpForm | null>(null);

  const attending = form.attendance === "Yes" || form.attendance === "Maybe";
  const notAttending = form.attendance === "No";

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name?.trim()) e.name = "Please enter your name.";
    if (!form.phone?.trim()) e.phone = "Please enter your phone number.";
    if (!form.attendance) e.attendance = "Please select an option.";
    if (attending) {
      const total =
        (form.adults ?? 0) + (form.kids5to10 ?? 0) + (form.kidsUnder5 ?? 0);
      if (total <= 0) e.adults = "Add at least one attendee.";
      if (!form.foodPref) e.foodPref = "Choose a food preference.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, _submit: undefined }));

    try {
      const payload: RsvpForm = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        attendance: form.attendance,
        adults: form.adults ?? undefined,
        kids5to10: form.kids5to10 ?? undefined,
        kidsUnder5: form.kidsUnder5 ?? undefined,
        foodPref: attending ? form.foodPref : undefined,
        allergens: attending ? form.allergens?.trim() || undefined : undefined,
        notes: form.notes?.trim() || undefined,
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.ok !== true) {
        throw new Error(json?.error || "Submission failed");
      }

      setSuccessData(payload);
      setErrors({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrors((prev) => ({ ...prev, _submit: msg }));
    } finally {
      setSubmitting(false);
    }
  }

  function startNewResponse() {
    setSuccessData(null);
    setForm({ name: "", phone: "" });
    setErrors({});
  }

  function editThisResponse() {
    if (successData) {
      setForm({
        name: successData.name || "",
        phone: successData.phone,
        attendance: successData.attendance,
        adults: successData.adults,
        kids5to10: successData.kids5to10,
        kidsUnder5: successData.kidsUnder5,
        foodPref: successData.foodPref,
        allergens: successData.allergens,
        notes: successData.notes,
      });
    }
    setSuccessData(null);
  }

  // ---------- SUCCESS VIEW ----------
  if (successData) {
    const notComing = successData.attendance === "No";
    return (
      <section className="px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <div
            className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 md:p-8 text-emerald-900 shadow-xl"
            aria-live="polite"
          >
            <h3 className="text-xl font-semibold">
              {notComing ? "Thanks for letting us know" : "Thank you! Your RSVP is in 🎉"}
            </h3>

            <p className="mt-2 text-sm">
              {notComing
                ? "We’ll miss you this time. Thanks for the quick response."
                : "We’re excited to celebrate with you! We’ll share any updates closer to the date."}
            </p>

            {/* Summary */}
            <div className="mt-4 grid gap-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> {successData.name}
              </div>
              {successData.phone && (
                <div>
                  <span className="font-medium">Phone:</span> {successData.phone}
                </div>
              )}
              <div>
                <span className="font-medium">Attendance:</span> {successData.attendance}
              </div>
              {successData.attendance !== "No" && (
                <>
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <span>
                      <span className="font-medium">Adults:</span> {successData.adults ?? 0}
                    </span>
                    <span>
                      <span className="font-medium">Kids 5–10:</span> {successData.kids5to10 ?? 0}
                    </span>
                    <span>
                      <span className="font-medium">Kids under 5:</span> {successData.kidsUnder5 ?? 0}
                    </span>
                  </div>
                  {successData.foodPref && (
                    <div>
                      <span className="font-medium">Food:</span> {successData.foodPref}
                    </div>
                  )}
                  {successData.allergens && (
                    <div>
                      <span className="font-medium">Allergens:</span> {successData.allergens}
                    </div>
                  )}
                </>
              )}
              {successData.notes && (
                <div>
                  <span className="font-medium">Notes:</span> {successData.notes}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={editThisResponse}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-emerald-900 ring-1 ring-emerald-300 hover:bg-emerald-100"
              >
                Edit this response
              </button>
              <button
                type="button"
                onClick={startNewResponse}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow hover:bg-emerald-700"
              >
                Fill another response
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------- FORM VIEW ----------
  return (
    <section className="px-2 py-10">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Why RSVP note */}
        <div className="mb-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 px-4 py-3">
          <p className="text-sm">
            <strong>Why RSVP?</strong> It helps us plan seating and food accurately so everyone’s
            comfortable. Please respond even if you <span className="underline underline-offset-2">can’t make it</span>. Thank you!
          </p>
        </div>

        {/* Submit error banner (persistent until next submit) */}
        {errors._submit && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 text-sm">
            {errors._submit}
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 md:p-10 text-black"
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
            className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p id="err-name" className="mt-1 text-xs text-red-600">
              {errors.name}
            </p>
          )}

          {/* Phone*/}
          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-black">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="e.g., 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p id="err-phone" className="mt-1 text-xs text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Attendance */}
          <fieldset className="mt-6">
            <legend className="block text-sm font-medium text-black">Will you attend?</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Yes", "No", "Maybe"] as Attendance[]).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center justify-center rounded-lg border px-3 py-2 cursor-pointer
                    ${form.attendance === opt ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-300 bg-white"}`}
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

          {/* If NOT attending: short message */}
          {notAttending && (
            <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
              Thanks for letting us know. No other details needed.
            </div>
          )}

          {/* Attending-only fields */}
          {attending && (
            <>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NumberField form={form} setForm={setForm} name="adults" label="Adults" />
                <NumberField form={form} setForm={setForm} name="kids5to10" label="Kids (5–10)" />
                <NumberField form={form} setForm={setForm} name="kidsUnder5" label="Kids (under 5)" />
              </div>
              {errors.adults && (
                <p className="mt-1 text-xs text-red-600">{errors.adults}</p>
              )}

              {/* Food preference */}
              <fieldset className="mt-6">
                <legend className="block text-sm font-medium text-black">
                  Food preference
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["Veg", "Non-Veg"] as FoodPref[]).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center justify-center rounded-lg border px-3 py-2 cursor-pointer
                        ${form.foodPref === opt ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-300 bg-white"}`}
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
                  className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
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
