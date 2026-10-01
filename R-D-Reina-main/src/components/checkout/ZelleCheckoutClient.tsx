"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { PaymentUpload } from "@/components/checkout/PaymentUpload";

const ZELLE_RECIPIENT = process.env.NEXT_PUBLIC_ZELLE_RECIPIENT ?? "rdbyreina@gmail.com";

export function ZelleCheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const [customer, setCustomer] = useState<Record<string, string> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("rd-checkout-customer");
    if (!raw) {
      router.replace("/checkout");
      return;
    }
    setCustomer(JSON.parse(raw));
  }, [router]);

  if (!customer || items.length === 0) {
    return (
      <p className="text-warm-gray">Loading checkout…</p>
    );
  }

  async function submit() {
    if (!file) {
      setError("Please upload your successful Zelle payment confirmation screenshot above before submitting.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("customer", JSON.stringify(customer));
      fd.append("items", JSON.stringify(items));
      fd.append("total", String(subtotal));
      fd.append("screenshot", file);

      const res = await fetch("/api/orders", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");

      sessionStorage.removeItem("rd-checkout-customer");
      if (data.order) {
        sessionStorage.setItem("rd-last-order", JSON.stringify(data.order));
      }
      clear();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#6d1ed4]/10 font-bold text-[#6d1ed4]">
            Z
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-warm-gray">Pay with</p>
            <p className="font-serif text-2xl">Zelle</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-warm-gray">
          Scan the QR code using your banking app and complete the payment for{" "}
          <strong>{formatPrice(subtotal)}</strong>. Then upload your confirmation
          screenshot below.
        </p>
        <div className="mt-6 flex flex-col items-center rounded-sm bg-white p-8 ring-1 ring-gold/20 shadow-sm">
          <Image
            src="/images/zelle-qr.png"
            alt="Zelle QR Code — R&D by Reina"
            width={220}
            height={220}
            className="h-56 w-56 object-contain rounded-md border border-gray-100 shadow-sm"
          />
          <p className="mt-4 text-sm text-center">
            Zelle Recipient: <strong className="text-gold-dark">{ZELLE_RECIPIENT}</strong>
          </p>
          <p className="mt-1 text-sm text-center text-warm-gray">
            Direct Phone: <strong className="text-charcoal">972-920-6561</strong>
          </p>
          <p className="mt-3 text-xl font-serif font-semibold text-gold-dark">{formatPrice(subtotal)}</p>
        </div>
        <PaymentUpload
          onFile={(f, p) => {
            setFile(f);
            setPreview(p);
          }}
        />
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        {!file && (
          <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2.5">
            ⚠️ <strong>Action Required:</strong> Please upload your payment confirmation screenshot above to enable order submission.
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={loading || !file}
          className="mt-5 w-full rounded-sm bg-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] text-ivory transition hover:bg-gold-dark disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? "Confirming payment & sending order…" : "Confirm Payment & Submit Order"}
        </button>

        <p className="mt-4 text-xs text-warm-gray leading-relaxed">
          Upon submission, full order details and your payment screenshot will be sent directly to <strong>{ZELLE_RECIPIENT}</strong> for prompt verification.
        </p>
      </div>
      <aside className="rounded-sm bg-white p-6 ring-1 ring-black/5 h-fit">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={`${i.productId}-${i.eventDate}`} className="flex justify-between">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-medium">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {preview && (
          <p className="mt-4 text-xs text-warm-gray">Screenshot attached for review.</p>
        )}
      </aside>
    </div>
  );
}
