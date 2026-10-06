"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { Order } from "@/types/order";
import { formatPrice, formatDisplayDate } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Phone,
  Mail,
  Upload,
  FileCheck,
} from "lucide-react";

export function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const orderRef = useRef<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // Re-upload state for rejected orders
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  const [reuploadPreview, setReuploadPreview] = useState<string | null>(null);
  const [reuploadLoading, setReuploadLoading] = useState(false);
  const [reuploadMsg, setReuploadMsg] = useState<{ text: string; error: boolean } | null>(null);

  const fetchOrder = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = (await res.json()) as Order;
      orderRef.current = data;
      setOrder(data);
      sessionStorage.setItem("rd-last-order", JSON.stringify(data));
      setError(false);
    } catch {
      if (!orderRef.current) setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    // Initial fetch from server
    const initialFetch = window.setTimeout(() => fetchOrder(), 0);

    // Auto-poll every 12 seconds if pending
    const interval = setInterval(() => {
      fetchOrder();
    }, 12000);

    return () => {
      window.clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchOrder]);

  async function handleReuploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reuploadFile) return;

    setReuploadLoading(true);
    setReuploadMsg(null);

    try {
      const fd = new FormData();
      fd.append("screenshot", reuploadFile);

      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload new screenshot");
      }

      setReuploadMsg({ text: data.message || "Screenshot updated successfully!", error: false });
      setReuploadFile(null);
      setReuploadPreview(null);
      if (data.order) {
        setOrder(data.order);
      } else {
        fetchOrder();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not re-upload screenshot";
      setReuploadMsg({ text: message, error: true });
    } finally {
      setReuploadLoading(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-sm border border-black/10 bg-white p-8 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" />
        <h2 className="mt-3 font-serif text-xl text-charcoal">Unable to Load Order</h2>
        <p className="mt-2 text-sm text-warm-gray max-w-md mx-auto">
          We could not locate this order. If you recently placed this reservation, please check your confirmation email or contact our support team.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => fetchOrder(true)}
            className="rounded-sm bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-gold-dark"
          >
            Try Again
          </button>
          <a
            href="tel:972-920-6561"
            className="rounded-sm border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-champagne/30"
          >
            Call Support (972-920-6561)
          </a>
        </div>
      </div>
    );
  }

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center p-12 text-warm-gray gap-3">
        <RefreshCw className="h-5 w-5 animate-spin text-gold" />
        <p className="text-sm">Loading reservation status and details…</p>
      </div>
    );
  }

  if (!order) return null;

  const displayId = order.orderNumber || order.orderId;
  const isPending = order.paymentStatus === "pending" || order.paymentStatus === "verification_pending";
  const isVerified = order.paymentStatus === "verified";
  const isRejected = order.paymentStatus === "rejected";

  return (
    <div className="space-y-8">
      {/* Live Refresh Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-warm-gray">
          Reference: #{displayId}
        </span>
        <button
          type="button"
          onClick={() => fetchOrder(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-gold" : ""}`} />
          {refreshing ? "Updating…" : "Refresh Status"}
        </button>
      </div>

      {/* DYNAMIC STATUS BANNER */}
      {isVerified && (
        <div className="rounded-sm border border-emerald-300 bg-emerald-50/70 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Payment Status: Verified &bull; Order Status: Confirmed
              </span>
              <h2 className="mt-1 font-serif text-2xl text-emerald-950">
                Reservation Confirmed!
              </h2>
              <p className="mt-2 text-sm text-emerald-900 leading-relaxed">
                Your Zelle payment of <strong>{formatPrice(order.total)}</strong> has been verified by our team. Your rental booking for <strong>{formatDisplayDate(order.customer.eventDate)}</strong> is officially reserved.
              </p>
              {order.paymentVerifiedAt && (
                <p className="mt-2 text-xs text-emerald-700">
                  Verified on {new Date(order.paymentVerifiedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="rounded-sm border border-amber-300 bg-amber-50/70 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Payment Status: Pending Verification &bull; Order Status: Pending Verification
              </span>
              <h2 className="mt-1 font-serif text-2xl text-amber-950">
                Payment Verification in Progress
              </h2>
              <p className="mt-2 text-sm text-amber-900 leading-relaxed">
                We have received your Zelle payment confirmation screenshot. An administrative notification was sent to <strong>rdbyreina@gmail.com</strong>. Our team will verify the payment and confirm your reservation shortly.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-amber-800">
                <span>Direct Concierge: <strong>972-920-6561</strong></span>
                <span>Email: <strong>rdbyreina@gmail.com</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="rounded-sm border border-red-300 bg-red-50/80 p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-800">
                Payment Status: Rejected &bull; Order Status: Payment Rejected
              </span>
              <h2 className="mt-1 font-serif text-2xl text-red-950">
                Action Required: Payment Verification Unsuccessful
              </h2>
              <p className="mt-2 text-sm text-red-900 leading-relaxed">
                Our operations team reviewed your payment screenshot but was unable to verify the transfer.
              </p>

              {/* Specific Rejection Reason Box */}
              <div className="mt-3 rounded-sm border border-red-200 bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">
                  Reason for Rejection:
                </span>
                <p className="mt-1 text-sm font-medium text-red-950">
                  {order.rejectionReason || "Please provide a clear transaction receipt showing the reference number and total amount."}
                </p>
              </div>

              {/* Re-upload Payment Proof Form */}
              <div className="mt-5 rounded-sm border border-black/10 bg-white p-5">
                <h3 className="font-serif text-base text-charcoal flex items-center gap-2">
                  <Upload className="h-4 w-4 text-gold" />
                  Re-Upload Payment Screenshot
                </h3>
                <p className="mt-1 text-xs text-warm-gray">
                  Please upload a new screenshot of your confirmed Zelle payment to allow our team to re-verify your reservation.
                </p>

                <form onSubmit={handleReuploadSubmit} className="mt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setReuploadFile(f);
                          setReuploadPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="text-xs text-charcoal file:mr-3 file:py-2 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-champagne/40 file:text-charcoal hover:file:bg-champagne/60 cursor-pointer"
                    />
                    <button
                      type="submit"
                      disabled={!reuploadFile || reuploadLoading}
                      className="rounded-sm bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-dark disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
                    >
                      {reuploadLoading ? "Uploading…" : "Submit New Proof"}
                    </button>
                  </div>

                  {reuploadPreview && (
                    <div className="mt-2 relative h-32 w-32 overflow-hidden rounded border border-black/10">
                      <Image src={reuploadPreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}

                  {reuploadMsg && (
                    <p className={`text-xs font-medium mt-2 ${reuploadMsg.error ? "text-red-700" : "text-emerald-700"}`}>
                      {reuploadMsg.text}
                    </p>
                  )}
                </form>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 pt-2 text-xs text-red-900 border-t border-red-200">
                <a href="tel:972-920-6561" className="inline-flex items-center gap-1 font-semibold underline">
                  <Phone className="h-3 w-3" /> Call 972-920-6561
                </a>
                <a href="mailto:rdbyreina@gmail.com" className="inline-flex items-center gap-1 font-semibold underline">
                  <Mail className="h-3 w-3" /> Email rdbyreina@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER & ORDER SUMMARY */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="font-serif text-lg text-charcoal">Customer &amp; Venue</h3>
          <ul className="mt-4 space-y-2 text-xs text-warm-gray">
            <li>
              <span className="uppercase tracking-wider">Name: </span>
              <strong className="text-charcoal">{order.customer.fullName}</strong>
            </li>
            <li>
              <span className="uppercase tracking-wider">Email: </span>
              <strong className="text-charcoal">{order.customer.email}</strong>
            </li>
            <li>
              <span className="uppercase tracking-wider">Phone: </span>
              <strong className="text-charcoal">{order.customer.phone}</strong>
            </li>
            <li>
              <span className="uppercase tracking-wider">Event Date: </span>
              <strong className="text-charcoal">{formatDisplayDate(order.customer.eventDate)}</strong>
            </li>
            <li>
              <span className="uppercase tracking-wider">Event Venue: </span>
              <strong className="text-charcoal">{order.customer.eventLocation}</strong>
            </li>
            <li>
              <span className="uppercase tracking-wider">Delivery Address: </span>
              <strong className="text-charcoal">{order.customer.address}</strong>
            </li>
            {order.customer.notes && (
              <li className="rounded bg-champagne/20 p-2 italic text-charcoal mt-2">
                &ldquo;{order.customer.notes}&rdquo;
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-charcoal">Payment &amp; Verification Info</h3>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-warm-gray uppercase tracking-wider">Payment Method</span>
                <p className="font-medium text-charcoal mt-0.5">Zelle Instant Transfer</p>
              </div>
              <div>
                <span className="text-warm-gray uppercase tracking-wider">Current Status</span>
                <p className="font-medium text-charcoal capitalize mt-0.5">
                  {order.paymentStatus.replace(/_/g, " ")} ({order.orderStatus.replace(/_/g, " ")})
                </p>
              </div>
              {order.paymentScreenshot?.filename && (
                <div>
                  <span className="text-warm-gray uppercase tracking-wider">Proof Uploaded</span>
                  <p className="font-medium text-charcoal flex items-center gap-1.5 mt-0.5">
                    <FileCheck className="h-3.5 w-3.5 text-gold" />
                    {order.paymentScreenshot.filename}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-black/5 pt-4 text-xs text-warm-gray">
            Need changes? Call <strong className="text-charcoal">972-920-6561</strong>
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="rounded-sm bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="font-serif text-lg text-charcoal">Reserved Rental Items</h3>
        <ul className="mt-4 divide-y divide-black/5 text-xs">
          {order.items.map((i) => (
            <li
              key={`${i.productId}-${i.eventDate}`}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="font-medium text-charcoal">{i.name}</p>
                <p className="text-[10px] text-warm-gray">
                  Qty: {i.quantity} &bull; Rental Date: {formatDisplayDate(i.eventDate)}
                </p>
              </div>
              <span className="font-medium text-charcoal font-mono">
                {formatPrice(i.price * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-black/5 pt-4 font-semibold text-sm">
          <span>Total Rental Amount</span>
          <span className="text-gold font-mono text-base">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

