"use client";

import { FormEvent, useState } from "react";

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("Thank you — we received your quote request and will respond shortly.");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please email rdbyreina@gmail.com.");
    }
  }

  const field =
    "mt-1 w-full rounded-sm border border-black/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold";

  if (status === "success") {
    return (
      <div className="rounded-sm bg-champagne/40 p-8 text-center">
        <h2 className="font-serif text-2xl">Request received</h2>
        <p className="mt-3 text-warm-gray">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-xs uppercase tracking-widest">
          Full name *
          <input name="fullName" required className={field} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Email *
          <input name="email" type="email" required className={field} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Phone *
          <input name="phone" type="tel" required className={field} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Event type *
          <input name="eventType" required className={field} placeholder="Wedding, corporate…" />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Event date *
          <input name="eventDate" type="date" required className={field} />
        </label>
        <label className="text-xs uppercase tracking-widest">
          Guest count
          <input name="guestCount" className={field} />
        </label>
      </div>
      <label className="text-xs uppercase tracking-widest">
        Event location *
        <input name="eventLocation" required className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Services needed
        <textarea name="servicesNeeded" rows={3} className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Budget range
        <input name="budgetRange" className={field} placeholder="$2,000 – $5,000" />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Message
        <textarea name="message" rows={4} className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Inspiration file (optional)
        <input name="attachment" type="file" className="mt-1 block w-full text-sm" />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-700">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-sm bg-charcoal py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
