"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "mt-1 w-full rounded-sm border border-black/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold";

  if (status === "success") {
    return (
      <div className="rounded-sm bg-champagne/40 p-6">
        <p className="font-serif text-xl">Message sent</p>
        <p className="mt-2 text-sm text-warm-gray">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="text-xs uppercase tracking-widest">
        Name *
        <input name="name" required className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Email *
        <input name="email" type="email" required className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Phone
        <input name="phone" type="tel" className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Subject *
        <input name="subject" required className={field} />
      </label>
      <label className="text-xs uppercase tracking-widest">
        Message *
        <textarea name="message" required rows={5} className={field} />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-700">Could not send. Try emailing us directly.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-sm bg-charcoal py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory"
      >
        Send message
      </button>
    </form>
  );
}
