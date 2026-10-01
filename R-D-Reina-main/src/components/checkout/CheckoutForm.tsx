"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, formatDisplayDate } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primaryDate = items[0]?.eventDate ?? "";

  function validate(form: FormData) {
    const next: Record<string, string> = {};
    const required = [
      "fullName",
      "email",
      "phone",
      "eventDate",
      "eventLocation",
      "address",
    ] as const;
    for (const key of required) {
      if (!String(form.get(key) ?? "").trim()) {
        next[key] = "Required";
      }
    }
    const email = String(form.get("email"));
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Invalid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!validate(form)) return;
    if (items.length === 0) return;

    const payload = {
      fullName: String(form.get("fullName")),
      email: String(form.get("email")),
      phone: String(form.get("phone")),
      eventDate: String(form.get("eventDate")),
      eventLocation: String(form.get("eventLocation")),
      address: String(form.get("address")),
      notes: String(form.get("notes") ?? ""),
    };

    sessionStorage.setItem("rd-checkout-customer", JSON.stringify(payload));
    router.push("/checkout/zelle");
  }

  if (items.length === 0) {
    return (
      <p className="text-warm-gray">
        Your cart is empty.{" "}
        <a href="/shop" className="text-gold underline">
          Browse rentals
        </a>
      </p>
    );
  }

  const fieldClass =
    "mt-1 w-full rounded-sm border border-black/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-xs uppercase tracking-widest">
          Full name
          <input name="fullName" className={fieldClass} autoComplete="name" />
          {errors.fullName && (
            <span className="mt-1 block text-xs text-red-700">{errors.fullName}</span>
          )}
        </label>
        <label className="block text-xs uppercase tracking-widest">
          Email
          <input
            name="email"
            type="email"
            className={fieldClass}
            autoComplete="email"
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-red-700">{errors.email}</span>
          )}
        </label>
        <label className="block text-xs uppercase tracking-widest">
          Phone
          <input
            name="phone"
            type="tel"
            className={fieldClass}
            autoComplete="tel"
          />
          {errors.phone && (
            <span className="mt-1 block text-xs text-red-700">{errors.phone}</span>
          )}
        </label>
        <label className="block text-xs uppercase tracking-widest">
          Event date
          <input
            name="eventDate"
            type="date"
            defaultValue={primaryDate}
            className={fieldClass}
          />
          {errors.eventDate && (
            <span className="mt-1 block text-xs text-red-700">{errors.eventDate}</span>
          )}
        </label>
      </div>
      <label className="block text-xs uppercase tracking-widest">
        Event location
        <input name="eventLocation" className={fieldClass} />
        {errors.eventLocation && (
          <span className="mt-1 block text-xs text-red-700">{errors.eventLocation}</span>
        )}
      </label>
      <label className="block text-xs uppercase tracking-widest">
        Address
        <input name="address" className={fieldClass} autoComplete="street-address" />
        {errors.address && (
          <span className="mt-1 block text-xs text-red-700">{errors.address}</span>
        )}
      </label>
      <label className="block text-xs uppercase tracking-widest">
        Additional notes
        <textarea name="notes" rows={4} className={fieldClass} />
      </label>

      <div className="rounded-sm bg-champagne/30 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest">
          Payment
        </h3>
        <p className="mt-2 text-sm">
          <strong>Zelle</strong> — continue to pay and upload your confirmation
          screenshot.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-sm bg-white p-4 border border-gold/20 shadow-sm">
          <Image
            src="/images/zelle-qr.png"
            alt="Zelle QR Code — R&D by Reina"
            width={160}
            height={160}
            className="h-36 w-36 object-contain rounded border border-gray-100 shadow-sm"
          />
          <div className="text-xs space-y-1.5 text-charcoal">
            <p className="font-semibold text-sm text-gold-dark">R&amp;D by Reina Zelle Pay</p>
            <p>
              Email: <span className="font-mono font-medium text-charcoal">rdbyreina@gmail.com</span>
            </p>
            <p>
              Phone: <span className="font-mono font-medium text-charcoal">972-920-6561</span>
            </p>
            <p className="text-[11px] text-warm-gray pt-1">
              Scan with your banking app (Chase, BoA, Wells Fargo, etc.) or send to the details above, then click below to upload your payment receipt.
            </p>
          </div>
        </div>
      </div>

      <aside className="rounded-sm ring-1 ring-black/5 p-5">
        <h3 className="font-serif text-xl">Order summary</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={`${i.productId}-${i.eventDate}`} className="flex justify-between gap-4">
              <span>
                {i.name} × {i.quantity}
                <span className="block text-xs text-warm-gray">
                  {formatDisplayDate(i.eventDate)}
                </span>
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-medium">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </aside>

      <button
        type="submit"
        className="w-full rounded-sm bg-charcoal py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ivory"
      >
        Continue to Zelle payment
      </button>
    </form>
  );
}
