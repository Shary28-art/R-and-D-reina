"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Order, QuoteRequest } from "@/types/order";
import { formatPrice, formatDisplayDate } from "@/lib/utils";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Key,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers/ToastProvider";

type Tab = "orders" | "quotes" | "inventory" | "categories";

export function AdminDashboardClient() {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [inventorySearch, setInventorySearch] = useState<string>("");

  // Admin authentication state
  const [adminKey, setAdminKey] = useState<string>("reina-admin-2026");
  const [passcodeModal, setPasscodeModal] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");

  // Verification & Rejection dialog states
  const [confirmVerifyModal, setConfirmVerifyModal] = useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const { toast } = useToast();

  async function loadData() {
    setLoading(true);
    try {
      const [ordersRes, quotesRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/quotes"),
      ]);
      if (ordersRes.ok) {
        const o = await ordersRes.json();
        setOrders(o);
      }
      if (quotesRes.ok) {
        const q = await quotesRes.json();
        setQuotes(q);
      }
    } catch {
      toast("Error loading admin data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = sessionStorage.getItem("rd-admin-key");
      if (storedKey) {
        setAdminKey(storedKey);
      }
    }
    loadData();
  }, []);

  // Listen for query param ?orderId=... to auto-open order review (e.g. from email link)
  useEffect(() => {
    if (typeof window !== "undefined" && orders.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryOrderId = urlParams.get("orderId");
      if (queryOrderId) {
        const found = orders.find(
          (o) => o.orderId === queryOrderId || o.orderNumber === queryOrderId
        );
        if (found) {
          setSelectedOrder(found);
          setTab("orders");
        }
      }
    }
  }, [orders]);

  async function handleVerifyPayment(order: Order) {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/orders/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          orderId: order.orderId,
          action: "verify",
          adminUser: "Reina Operations",
          adminKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setPasscodeModal(true);
          throw new Error("Admin authorization required. Please verify your passcode.");
        }
        throw new Error(data.error || "Failed to verify payment");
      }

      toast(data.message || "Payment verified & reservation confirmed!", "success");
      setConfirmVerifyModal(false);
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? data.order : o)));
        setSelectedOrder(data.order);
      } else {
        loadData();
      }
    } catch (err: any) {
      toast(err?.message || "Could not verify payment", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRejectPayment(order: Order) {
    if (!rejectionReason.trim()) {
      toast("Please provide a reason for rejecting the payment.", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/orders/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          orderId: order.orderId,
          action: "reject",
          reason: rejectionReason.trim(),
          adminUser: "Reina Operations",
          adminKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setPasscodeModal(true);
          throw new Error("Admin authorization required. Please verify your passcode.");
        }
        throw new Error(data.error || "Failed to reject payment");
      }

      toast(data.message || "Payment rejected and customer notified.", "success");
      setRejectModalOpen(false);
      setRejectionReason("");
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? data.order : o)));
        setSelectedOrder(data.order);
      } else {
        loadData();
      }
    } catch (err: any) {
      toast(err?.message || "Could not reject payment", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, orderStatus: string) {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      if (data.order) {
        setOrders((prev) => prev.map((o) => (o.orderId === orderId ? data.order : o)));
        if (selectedOrder?.orderId === orderId) {
          setSelectedOrder(data.order);
        }
      }
      toast(`Order marked as ${orderStatus}`, "success");
    } catch {
      toast("Could not update status", "error");
    }
  }

  function handleSavePasscode(e: React.FormEvent) {
    e.preventDefault();
    if (passcodeInput.trim()) {
      setAdminKey(passcodeInput.trim());
      sessionStorage.setItem("rd-admin-key", passcodeInput.trim());
      setPasscodeModal(false);
      setPasscodeInput("");
      toast("Admin passcode saved for this session", "success");
    }
  }

  const pendingVerificationCount = orders.filter(
    (o) => o.paymentStatus === "pending" || o.paymentStatus === "verification_pending"
  ).length;
  const verifiedCount = orders.filter((o) => o.paymentStatus === "verified").length;
  const rejectedCount = orders.filter((o) => o.paymentStatus === "rejected").length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "pending") {
      return o.paymentStatus === "pending" || o.paymentStatus === "verification_pending";
    }
    if (orderFilter === "verified") return o.paymentStatus === "verified";
    if (orderFilter === "rejected") return o.paymentStatus === "rejected";
    if (orderFilter === "confirmed") {
      return o.orderStatus === "Confirmed" || o.orderStatus === "confirmed";
    }
    return true;
  });

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Administrative Console
          </span>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl text-charcoal">
            R&amp;D by Reina Operations
          </h1>
          <p className="mt-1 text-sm text-warm-gray">
            Verify Zelle payments, fulfill customer rental reservations, and review custom event quotes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPasscodeModal(true)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-black/10 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
            title="Configure Admin Security Key"
          >
            <Key className="h-3.5 w-3.5 text-gold" />
            Security Key
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-2">
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === "orders"
              ? "bg-charcoal text-ivory shadow-sm"
              : "text-warm-gray hover:bg-champagne/30"
          }`}
        >
          Orders &amp; Zelle Verification
          {pendingVerificationCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] text-white">
              {pendingVerificationCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("quotes")}
          className={`flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === "quotes"
              ? "bg-charcoal text-ivory shadow-sm"
              : "text-warm-gray hover:bg-champagne/30"
          }`}
        >
          Quote Requests ({quotes.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("inventory")}
          className={`flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === "inventory"
              ? "bg-charcoal text-ivory shadow-sm"
              : "text-warm-gray hover:bg-champagne/30"
          }`}
        >
          Inventory &amp; Catalog ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("categories")}
          className={`flex items-center gap-2 rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === "categories"
              ? "bg-charcoal text-ivory shadow-sm"
              : "text-warm-gray hover:bg-champagne/30"
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* TAB 1: ORDERS & ZELLE VERIFICATION */}
      {tab === "orders" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-warm-gray" />
              <span className="text-xs uppercase tracking-wider text-warm-gray">Filter:</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="rounded-sm border border-black/10 bg-white px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending Zelle Verification ({pendingVerificationCount})</option>
                <option value="verified">Verified Payments ({verifiedCount})</option>
                <option value="rejected">Rejected Payments ({rejectedCount})</option>
                <option value="confirmed">Confirmed Reservations</option>
              </select>
            </div>
            <p className="text-xs text-warm-gray">
              Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="overflow-x-auto rounded-sm border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/5 bg-champagne/30 text-xs font-semibold uppercase tracking-wider text-charcoal">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Event Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Reservation Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-warm-gray">
                      No orders matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const isPendingOrder = o.paymentStatus === "pending" || o.paymentStatus === "verification_pending";
                    const isVerifiedOrder = o.paymentStatus === "verified";
                    const isRejectedOrder = o.paymentStatus === "rejected";

                    return (
                      <tr key={o.orderId} className="hover:bg-champagne/10">
                        <td className="p-4 font-mono font-bold text-charcoal text-xs">
                          {o.orderNumber || o.orderId}
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-charcoal">{o.customer.fullName}</p>
                          <p className="text-xs text-warm-gray">{o.customer.email}</p>
                          <p className="text-xs text-warm-gray">{o.customer.phone}</p>
                        </td>
                        <td className="p-4 text-charcoal text-xs">
                          {formatDisplayDate(o.eventDate)}
                        </td>
                        <td className="p-4 font-medium text-charcoal font-mono">
                          {formatPrice(o.total)}
                        </td>
                        <td className="p-4">
                          {isPendingOrder ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                              <Clock className="h-3 w-3" />
                              Pending Verification
                            </span>
                          ) : isVerifiedOrder ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </span>
                          ) : isRejectedOrder ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </span>
                          ) : (
                            <span className="text-xs text-warm-gray capitalize">{o.paymentStatus}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="capitalize text-xs font-medium text-charcoal">
                            {o.orderStatus.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            className={`inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                              isPendingOrder
                                ? "bg-charcoal text-ivory hover:bg-gold-dark shadow-sm"
                                : "border border-black/10 text-charcoal hover:bg-champagne/30"
                            }`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {isPendingOrder ? "Review Payment" : "View"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUOTE REQUESTS */}
      {tab === "quotes" && (
        <div className="space-y-6">
          <p className="text-sm text-warm-gray">
            Inquiries submitted via the Request a Quote page. Contact customers to finalize custom proposals.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {quotes.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-warm-gray">
                No quote requests submitted yet.
              </p>
            ) : (
              quotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-sm border border-black/10 bg-white p-6 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-start justify-between border-b border-black/5 pb-4">
                    <div>
                      <span className="font-mono text-xs text-gold font-semibold">{q.id}</span>
                      <h3 className="font-serif text-xl text-charcoal">{q.fullName}</h3>
                      <p className="text-xs text-warm-gray">
                        {new Date(q.createdAt).toLocaleDateString()} at{" "}
                        {new Date(q.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="rounded-full bg-champagne/50 px-3 py-1 text-xs font-medium text-charcoal">
                      {q.eventType}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="uppercase tracking-wider text-warm-gray">Event Date</span>
                      <p className="font-medium text-charcoal mt-0.5">{formatDisplayDate(q.eventDate)}</p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wider text-warm-gray">Guest Count</span>
                      <p className="font-medium text-charcoal mt-0.5">{q.guestCount || "Not specified"}</p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wider text-warm-gray">Location</span>
                      <p className="font-medium text-charcoal mt-0.5">{q.eventLocation}</p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wider text-warm-gray">Budget</span>
                      <p className="font-medium text-charcoal mt-0.5">{q.budgetRange || "Not specified"}</p>
                    </div>
                  </div>

                  {q.servicesNeeded && (
                    <div className="mt-4 border-t border-black/5 pt-3">
                      <span className="text-[10px] uppercase tracking-wider text-warm-gray">Services Requested</span>
                      <p className="mt-1 text-xs text-charcoal leading-relaxed">{q.servicesNeeded}</p>
                    </div>
                  )}

                  {q.message && (
                    <div className="mt-3 rounded-sm bg-champagne/20 p-3 text-xs italic text-charcoal/90">
                      &ldquo;{q.message}&rdquo;
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">
                    <div className="text-xs text-warm-gray">
                      <a href={`mailto:${q.email}`} className="text-gold underline hover:text-charcoal mr-3">
                        {q.email}
                      </a>
                      <a href={`tel:${q.phone}`} className="hover:text-charcoal">
                        {q.phone}
                      </a>
                    </div>
                    <a
                      href={`mailto:${q.email}?subject=R%26D%20by%20Reina%20Quote%20Follow-up%20(${q.id})`}
                      className="rounded-sm bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-charcoal/90"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & CATALOG */}
      {tab === "inventory" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray" />
              <input
                type="search"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search catalog products..."
                className="w-full rounded-sm border border-black/10 bg-white py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <p className="text-xs text-warm-gray">
              Total items: {products.length} | Filtered: {filteredProducts.length}
            </p>
          </div>

          <div className="overflow-x-auto rounded-sm border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/5 bg-champagne/30 text-xs font-semibold uppercase tracking-wider text-charcoal">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Subcategory</th>
                  <th className="p-4">Rental Rate</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-champagne/10">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-champagne/20">
                          <Image src={p.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{p.name}</p>
                          <p className="text-xs text-warm-gray font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-charcoal">{p.category}</td>
                    <td className="p-4 text-xs text-warm-gray">{p.subcategory}</td>
                    <td className="p-4 text-xs font-medium text-charcoal">{formatPrice(p.price)}</td>
                    <td className="p-4 text-xs font-mono">{p.inventory.totalStock} units</td>
                    <td className="p-4 text-xs">
                      {p.inventory.totalStock > 10 ? (
                        <span className="text-emerald-700">● In Stock</span>
                      ) : p.inventory.totalStock > 0 ? (
                        <span className="text-amber-700">▲ Limited ({p.inventory.totalStock})</span>
                      ) : (
                        <span className="text-red-700">✕ Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES */}
      {tab === "categories" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col justify-between rounded-sm border border-black/10 bg-white p-5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                    {c.navGroup}
                  </span>
                  <span className="text-xs text-warm-gray">
                    {c.subcategories.length} subcategories
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-xl text-charcoal">{c.name}</h3>
                <p className="mt-2 text-xs text-warm-gray">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {c.subcategories.map((sc) => (
                    <span
                      key={sc.slug}
                      className="rounded bg-champagne/30 px-2 py-0.5 text-[10px] text-charcoal"
                    >
                      {sc.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDER DETAIL & ZELLE VERIFICATION MODAL */}
      {selectedOrder && (
        <Modal
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Rental Order #${selectedOrder.orderNumber || selectedOrder.orderId}`}
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Status alerts */}
            <div className="rounded-sm bg-champagne/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-warm-gray">Payment Status</span>
                  <p className="font-serif text-lg font-medium capitalize text-charcoal flex items-center gap-1.5 mt-0.5">
                    {selectedOrder.paymentStatus === "verified" ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-4 w-4" /> Verified
                      </span>
                    ) : selectedOrder.paymentStatus === "rejected" ? (
                      <span className="text-red-700 flex items-center gap-1 font-semibold">
                        <XCircle className="h-4 w-4" /> Rejected
                      </span>
                    ) : (
                      <span className="text-amber-800 flex items-center gap-1 font-semibold">
                        <Clock className="h-4 w-4" /> Pending Verification
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-warm-gray">Reservation Status</span>
                  <p className="font-serif text-lg font-medium capitalize text-charcoal mt-0.5">
                    {selectedOrder.orderStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Trail Badge */}
            {selectedOrder.paymentStatus === "verified" && (
              <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                <span className="font-semibold">✓ Verification Audit:</span> Payment verified by{" "}
                <strong>{selectedOrder.paymentVerifiedBy || "Reina Operations"}</strong> on{" "}
                {selectedOrder.paymentVerifiedAt ? new Date(selectedOrder.paymentVerifiedAt).toLocaleString() : "record"}.
              </div>
            )}

            {selectedOrder.paymentStatus === "rejected" && (
              <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-900 space-y-1">
                <p>
                  <span className="font-semibold">✕ Rejection Record:</span> Rejected by{" "}
                  <strong>{selectedOrder.paymentRejectedBy || "Reina Operations"}</strong> on{" "}
                  {selectedOrder.paymentRejectedAt ? new Date(selectedOrder.paymentRejectedAt).toLocaleString() : "record"}.
                </p>
                {selectedOrder.rejectionReason && (
                  <p className="bg-white/80 p-2 rounded border border-red-200 font-medium">
                    Reason: &ldquo;{selectedOrder.rejectionReason}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Customer Details */}
            <div className="rounded-sm border border-black/5 bg-white p-4">
              <h4 className="font-serif text-base text-charcoal">Customer &amp; Venue Details</h4>
              <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-warm-gray uppercase tracking-wider">Full Name:</span>
                  <p className="font-medium text-charcoal mt-0.5">{selectedOrder.customer.fullName}</p>
                </div>
                <div>
                  <span className="text-warm-gray uppercase tracking-wider">Email:</span>
                  <p className="font-medium text-charcoal mt-0.5">
                    <a href={`mailto:${selectedOrder.customer.email}`} className="text-gold underline">
                      {selectedOrder.customer.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-warm-gray uppercase tracking-wider">Phone:</span>
                  <p className="font-medium text-charcoal mt-0.5">
                    <a href={`tel:${selectedOrder.customer.phone}`} className="hover:text-gold">
                      {selectedOrder.customer.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-warm-gray uppercase tracking-wider">Event Date:</span>
                  <p className="font-medium text-charcoal mt-0.5">{formatDisplayDate(selectedOrder.customer.eventDate)}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-warm-gray uppercase tracking-wider">Event Venue:</span>
                  <p className="font-medium text-charcoal mt-0.5">{selectedOrder.customer.eventLocation}</p>
                </div>
                {selectedOrder.customer.address && (
                  <div className="sm:col-span-2">
                    <span className="text-warm-gray uppercase tracking-wider">Delivery Address:</span>
                    <p className="font-medium text-charcoal mt-0.5">{selectedOrder.customer.address}</p>
                  </div>
                )}
                {selectedOrder.customer.notes && (
                  <div className="sm:col-span-2 rounded bg-champagne/20 p-2 italic mt-1">
                    <span className="not-italic text-warm-gray font-medium">Customer Notes: </span>
                    {selectedOrder.customer.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-sm border border-black/5 bg-white p-4">
              <h4 className="font-serif text-base text-charcoal">Reserved Rental Items</h4>
              <ul className="mt-3 divide-y divide-black/5 text-xs">
                {selectedOrder.items.map((i) => (
                  <li key={`${i.productId}-${i.eventDate}`} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-champagne/20">
                        <Image src={i.image} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{i.name}</p>
                        <p className="text-[10px] text-warm-gray">
                          Qty: {i.quantity} × {formatPrice(i.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-charcoal font-mono">
                      {formatPrice(i.price * i.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t border-black/5 pt-3 font-semibold text-sm">
                <span>Total Amount:</span>
                <span className="text-gold font-mono">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Payment Screenshot Proof Card */}
            <div className="rounded-sm border border-black/5 bg-white p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base text-charcoal">Zelle Payment Proof</h4>
                {selectedOrder.paymentScreenshot?.filename && (
                  <span className="text-[10px] uppercase font-mono text-warm-gray">
                    {selectedOrder.paymentScreenshot.filename}
                  </span>
                )}
              </div>

              {selectedOrder.paymentScreenshot?.dataUrl ? (
                <div className="mt-3 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-sm bg-champagne/20 p-3">
                    <div
                      onClick={() => setScreenshotModal(selectedOrder.paymentScreenshot?.dataUrl ?? null)}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded border border-black/10 bg-white cursor-pointer group"
                      title="Click to view full-size"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedOrder.paymentScreenshot.dataUrl}
                        alt="Payment proof thumbnail"
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-charcoal">
                        Uploaded Screenshot: {selectedOrder.paymentScreenshot.filename}
                      </p>
                      <p className="text-[11px] text-warm-gray mt-0.5">
                        MIME: {selectedOrder.paymentScreenshot.mimeType}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setScreenshotModal(selectedOrder.paymentScreenshot?.dataUrl ?? null)}
                          className="inline-flex items-center gap-1 rounded-sm bg-white border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-champagne/40"
                        >
                          <Eye className="h-3.5 w-3.5 text-gold" />
                          Preview Full Size
                        </button>
                        <a
                          href={selectedOrder.paymentScreenshot.dataUrl}
                          download={selectedOrder.paymentScreenshot.filename || `payment-proof-${selectedOrder.orderNumber || selectedOrder.orderId}.png`}
                          className="inline-flex items-center gap-1 rounded-sm bg-white border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-champagne/40"
                        >
                          <Download className="h-3.5 w-3.5 text-gold" />
                          Download Screenshot
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-warm-gray">No screenshot attached for this order.</p>
              )}
            </div>

            {/* Actions for Verifying Zelle Payment */}
            <div className="space-y-3 pt-2">
              {/* If Pending: Show Verify & Reject Actions */}
              {(selectedOrder.paymentStatus === "pending" || selectedOrder.paymentStatus === "verification_pending") && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setConfirmVerifyModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-sm bg-emerald-800 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-900 transition shadow-sm"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectionReason("");
                      setRejectModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-sm border border-red-300 bg-red-50/60 py-3 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-100/80 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Payment
                  </button>
                </div>
              )}

              {/* If already verified: Prevent double-verification and show verified badge */}
              {selectedOrder.paymentStatus === "verified" && (
                <div className="flex flex-col gap-2 sm:flex-row items-center">
                  <div className="flex-1 text-center sm:text-left py-2 px-3 rounded bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                    <Check className="h-4 w-4 text-emerald-700" />
                    Payment Officially Verified
                  </div>
                  {selectedOrder.orderStatus !== "completed" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, "completed")}
                      className="rounded-sm border border-charcoal py-2 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-champagne/30 transition"
                    >
                      Mark Event Completed
                    </button>
                  )}
                </div>
              )}

              {/* If already rejected: Display rejected badge */}
              {selectedOrder.paymentStatus === "rejected" && (
                <div className="space-y-2">
                  <div className="text-center py-2 px-3 rounded bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    <XCircle className="h-4 w-4 text-red-700" />
                    Payment Rejected
                  </div>
                  <p className="text-xs text-warm-gray text-center">
                    Customer has been notified to provide an updated payment confirmation screenshot.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM VERIFY MODAL */}
      {confirmVerifyModal && selectedOrder && (
        <Modal
          open={confirmVerifyModal}
          onClose={() => setConfirmVerifyModal(false)}
          title="Confirm Payment Verification"
        >
          <div className="space-y-5">
            <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-base font-bold text-emerald-950">
                    Verify Payment for Order #{selectedOrder.orderNumber || selectedOrder.orderId}
                  </h4>
                  <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
                    Customer: <strong>{selectedOrder.customer.fullName}</strong> &bull; Total:{" "}
                    <strong>{formatPrice(selectedOrder.total)}</strong>
                  </p>
                  <p className="mt-2 text-xs text-emerald-800 leading-relaxed">
                    Are you sure you want to verify this Zelle payment? This action will:
                  </p>
                  <ul className="mt-1.5 list-disc pl-4 text-xs text-emerald-800 space-y-0.5">
                    <li>Update order status to <strong>Confirmed</strong></li>
                    <li>Record verification timestamp &amp; administrative audit logs</li>
                    <li>Automatically send an official confirmation receipt email to <strong>{selectedOrder.customer.email}</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmVerifyModal(false)}
                disabled={actionLoading}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyPayment(selectedOrder)}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-sm bg-emerald-800 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-900 disabled:opacity-50 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {actionLoading ? "Verifying & Sending Email…" : "Confirm Verification"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* REJECT PAYMENT MODAL */}
      {rejectModalOpen && selectedOrder && (
        <Modal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Zelle Payment Proof"
        >
          <div className="space-y-4">
            <p className="text-xs text-warm-gray leading-relaxed">
              Order: <strong>#{selectedOrder.orderNumber || selectedOrder.orderId}</strong> &bull; Customer:{" "}
              <strong>{selectedOrder.customer.fullName}</strong> ({selectedOrder.customer.email})
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                Rejection Reason (Required)
              </label>
              <p className="text-[11px] text-warm-gray mt-0.5">
                This message will be emailed to the customer so they can rectify the issue.
              </p>

              {/* Quick-pick reason presets */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Transaction not found in our Zelle records",
                  "Payment amount does not match order total",
                  "Screenshot is blurry or unreadable",
                  "Recipient name does not match our account",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="rounded bg-champagne/30 px-2 py-1 text-[10px] text-charcoal hover:bg-champagne/60 transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Describe why the payment could not be verified (e.g., Transaction ID missing or amount discrepancy)..."
                className="mt-2.5 w-full rounded-sm border border-black/20 p-2.5 text-xs outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                disabled={actionLoading}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectPayment(selectedOrder)}
                disabled={actionLoading || !rejectionReason.trim()}
                className="inline-flex items-center gap-2 rounded-sm bg-red-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 disabled:opacity-50 transition"
              >
                <XCircle className="h-3.5 w-3.5" />
                {actionLoading ? "Rejecting & Notifying…" : "Reject Payment & Email Customer"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* PASSCODE SETTINGS MODAL */}
      {passcodeModal && (
        <Modal
          open={passcodeModal}
          onClose={() => setPasscodeModal(false)}
          title="Admin Security Key"
        >
          <form onSubmit={handleSavePasscode} className="space-y-4">
            <p className="text-xs text-warm-gray leading-relaxed">
              Administrative payment verification and rejection actions require a valid security key.
            </p>
            <div>
              <label className="block text-xs font-medium text-charcoal">Security Passcode</label>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Enter admin passcode (e.g. reina-admin-2026)"
                className="mt-1 w-full rounded-sm border border-black/20 p-2 text-xs outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPasscodeModal(false)}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-sm bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-dark"
              >
                Save Passcode
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* SCREENSHOT PREVIEW MODAL */}
      {screenshotModal && (
        <Modal
          open={Boolean(screenshotModal)}
          onClose={() => setScreenshotModal(null)}
          title="Payment Screenshot Proof Inspection"
        >
          <div className="space-y-4">
            <div className="relative aspect-auto max-h-[70vh] w-full overflow-hidden rounded-sm bg-black/5 flex items-center justify-center p-2">
              {screenshotModal.startsWith("data:image") || screenshotModal.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={screenshotModal}
                  alt="Payment screenshot proof"
                  className="max-h-[68vh] w-auto object-contain rounded-sm shadow-md"
                />
              ) : (
                <p className="p-8 text-xs text-warm-gray">Document file uploaded ({screenshotModal.slice(0, 30)}...)</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <a
                href={screenshotModal}
                download="payment-screenshot.png"
                className="inline-flex items-center gap-1.5 rounded-sm bg-charcoal px-4 py-2 text-xs font-bold uppercase tracking-wider text-ivory hover:bg-gold-dark"
              >
                <Download className="h-3.5 w-3.5 text-gold" />
                Download Original
              </a>
              <button
                type="button"
                onClick={() => setScreenshotModal(null)}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal hover:bg-champagne/20"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

