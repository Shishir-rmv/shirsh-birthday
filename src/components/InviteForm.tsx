"use client";

import React from "react";

type Attendance = "Yes" | "No" | "Maybe";

type FormState = {
  name: string;
  phone: string;
  attendance: Attendance;

  // Only needed if attending (Yes/Maybe)
  adults: number;
  kids5to10: number;
  kidsU5: number;
  foodPref: "Veg" | "Non-Veg" | "Mixed";
  vegCount: number;
  nonVegCount: number;
  allergens: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  phone: "",
  attendance: "Yes",
  adults: 0,
  kids5to10: 0,
  kidsU5: 0,
  foodPref: "Veg",
  vegCount: 0,
  nonVegCount: 0,
  allergens: "",
  notes: "",
};

export default function InviteForm() {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedAttendance, setSubmittedAttendance] = React.useState<"Yes" | "No" | "Maybe">("Yes");
  const [errors, setErrors] = React.useState<Errors>({});
  const [toast, setToast] = React.useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  React.useEffect(() => {
    if (!toast.show) return;
    const id = setTimeout(() => setToast({ show: false, message: "" }), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;

    // Attendance-specific behavior
    if (name === "attendance") {
      const nextAttendance = value as Attendance;
      setForm((prev) => {
        // If switching to "No", clear/zero optional fields
        if (nextAttendance === "No") {
          return {
            ...prev,
            attendance: nextAttendance,
            adults: 0,
            kids5to10: 0,
            kidsU5: 0,
            foodPref: "Veg",
            vegCount: 0,
            nonVegCount: 0,
            allergens: "",
            notes: "",
          };
        }
        return { ...prev, attendance: nextAttendance };
      });
      if (errors.attendance) {
        setErrors((prev) => {
          const { attendance, ...rest } = prev;
          return rest;
        });
      }
      return;
    }

    setForm((f) => ({
      ...f,
      [name]:
        name === "adults" ||
        name.startsWith("kids") ||
        name.endsWith("Count")
          ? Number(value)
          : value,
    }));

    // clear per-field error on edit
    if (errors[name as keyof FormState]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormState];
        return next;
      });
    }
  };

  const validate = (): Errors => {
    const e: Errors = {};

    // Always required
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^\+?\d[\d\s\-]{7,}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number.";

    // If NOT attending, skip all other checks
    if (form.attendance === "No") return e;

    // Validations for attending (Yes/Maybe)
    if (form.adults < 0) e.adults = "Cannot be negative.";
    if (form.kids5to10 < 0) e.kids5to10 = "Cannot be negative.";
    if (form.kidsU5 < 0) e.kidsU5 = "Cannot be negative.";

    if (form.foodPref === "Mixed") {
      const v = Number(form.vegCount) || 0;
      const n = Number(form.nonVegCount) || 0;
      const total =
        (Number(form.adults) || 0) +
        (Number(form.kids5to10) || 0) +
        (Number(form.kidsU5) || 0);
      if (v < 0) e.vegCount = "Cannot be negative.";
      if (n < 0) e.nonVegCount = "Cannot be negative.";
      if (v + n > total) {
        e.vegCount = "Veg + Non-veg exceed total guests.";
        e.nonVegCount = "Veg + Non-veg exceed total guests.";
      }
    }

    return e;
  };

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      // If not attending, send zeros/empties for the rest
      const payload =
        form.attendance === "No"
          ? {
              name: form.name.trim(),
              phone: form.phone.trim(),
              attendance: form.attendance,
              adults: 0,
              kids5to10: 0,
              kidsU5: 0,
              foodPref: "",
              vegCount: 0,
              nonVegCount: 0,
              allergens: "",
              notes: "",
              source: "custom-site",
            }
          : { ...form, source: "custom-site" };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok !== true) {
        setToast({ show: true, message: "Submission failed. Please try again." });
        } else {
        // capture what the user actually submitted
        setSubmittedAttendance(form.attendance);

        setSubmitted(true);

        // nicer toast per attendance
        setToast({
            show: true,
            message:
            form.attendance === "No"
                ? "Thanks for letting us know you can’t make it."
                : "Thanks! Your RSVP is recorded.",
        });

        // now it’s safe to reset the form
        setForm(initialForm);
        setErrors({});
        }
    } catch {
      setToast({ show: true, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `w-full rounded-xl border px-3 py-2 ${
      errors[field] ? "border-red-500 focus:outline-red-500" : "border-gray-300"
    }`;

  if (submitted) {
    return (
        <>
        <Toast show={toast.show} message={toast.message} />
        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Thank you! 🎉</h2>
            {submittedAttendance === "No" ? (
            <p className="text-gray-600">
                We’re sorry you can’t make it, but thank you for letting us know. 
                We’ll miss you at the celebration!
            </p>
            ) : (
            <p className="text-gray-600">
                Your RSVP has been recorded. We can’t wait to celebrate with you.
            </p>
            )}
            <button
            className="mt-4 text-indigo-600 underline"
            onClick={() => setSubmitted(false)}
            >
            Submit another response
            </button>
        </div>
        </>
    );
    }


  const isAttending = form.attendance !== "No";

  return (
    <>
      <Toast show={toast.show} message={toast.message} />
      <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6">
        <h2 className="h-heading mb-4">RSVP</h2>

        <p className="mb-4 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        Kindly take a moment to fill this form, even if you are <b>not attending</b>.
        It helps us plan food, seating and arrangements properly, so that we can
        welcome everyone without wastage or shortage. Thank you for your support! 🙏
        </p>


        <div className="grid sm:grid-cols-2 gap-4">
          {/* Always required */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className={inputClass("name")}
              placeholder="e.g., Ananya Sharma"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-name" : undefined}
            />
            {errors.name && (
              <p id="err-name" className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className={inputClass("phone")}
              placeholder="e.g., +91 98xxxxxxx"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
            />
            {errors.phone && (
              <p id="err-phone" className="mt-1 text-xs text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Attendance toggle (drives conditional UI) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Will you attend?
            </label>
            <select
              name="attendance"
              value={form.attendance}
              onChange={onChange}
              className={inputClass("attendance")}
            >
              <option>Yes</option>
              <option>No</option>
              <option>Maybe</option>
            </select>
          </div>

          {/* Only show these when attending Yes/Maybe */}
          {isAttending && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Adults</label>
                <input
                  type="number"
                  name="adults"
                  min={0}
                  value={form.adults}
                  onChange={onChange}
                  className={inputClass("adults")}
                  aria-invalid={!!errors.adults}
                  aria-describedby={errors.adults ? "err-adults" : undefined}
                />
                {errors.adults && (
                  <p id="err-adults" className="mt-1 text-xs text-red-600">
                    {errors.adults}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kids 5–10
                </label>
                <input
                  type="number"
                  name="kids5to10"
                  min={0}
                  value={form.kids5to10}
                  onChange={onChange}
                  className={inputClass("kids5to10")}
                  aria-invalid={!!errors.kids5to10}
                  aria-describedby={
                    errors.kids5to10 ? "err-kids5to10" : undefined
                  }
                />
                {errors.kids5to10 && (
                  <p id="err-kids5to10" className="mt-1 text-xs text-red-600">
                    {errors.kids5to10}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kids under 5
                </label>
                <input
                  type="number"
                  name="kidsU5"
                  min={0}
                  value={form.kidsU5}
                  onChange={onChange}
                  className={inputClass("kidsU5")}
                  aria-invalid={!!errors.kidsU5}
                  aria-describedby={errors.kidsU5 ? "err-kidsU5" : undefined}
                />
                {errors.kidsU5 && (
                  <p id="err-kidsU5" className="mt-1 text-xs text-red-600">
                    {errors.kidsU5}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Food Preference
                </label>
                <select
                  name="foodPref"
                  value={form.foodPref}
                  onChange={onChange}
                  className={inputClass("foodPref")}
                >
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Mixed</option>
                </select>
              </div>

              {form.foodPref === "Mixed" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Veg count (approx)
                    </label>
                    <input
                      type="number"
                      name="vegCount"
                      min={0}
                      value={form.vegCount}
                      onChange={onChange}
                      className={inputClass("vegCount")}
                      aria-invalid={!!errors.vegCount}
                      aria-describedby={errors.vegCount ? "err-veg" : undefined}
                    />
                    {errors.vegCount && (
                      <p id="err-veg" className="mt-1 text-xs text-red-600">
                        {errors.vegCount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Non-veg count (approx)
                    </label>
                    <input
                      type="number"
                      name="nonVegCount"
                      min={0}
                      value={form.nonVegCount}
                      onChange={onChange}
                      className={inputClass("nonVegCount")}
                      aria-invalid={!!errors.nonVegCount}
                      aria-describedby={
                        errors.nonVegCount ? "err-nonveg" : undefined
                      }
                    />
                    {errors.nonVegCount && (
                      <p id="err-nonveg" className="mt-1 text-xs text-red-600">
                        {errors.nonVegCount}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Allergens (if any)
                </label>
                <input
                  name="allergens"
                  value={form.allergens}
                  onChange={onChange}
                  className={inputClass("allergens")}
                  placeholder="e.g., Nuts, dairy, gluten"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={onChange}
                  rows={3}
                  className={inputClass("notes")}
                  placeholder="Anything we should know"
                />
              </div>
            </>
          )}
        </div>

        {Object.keys(errors).length > 0 && (
          <p className="mt-3 text-sm text-red-600">
            Please fix the highlighted fields.
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            disabled={submitting}
            className="rounded-xl bg-indigo-600 text-white px-5 py-2 font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Send RSVP"}
          </button>
          <span className="text-sm text-gray-500">
            We’ll use your phone only for event coordination.
          </span>
        </div>
      </form>
    </>
  );
}

function Toast({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 text-sm"
    >
      {message}
    </div>
  );
}
