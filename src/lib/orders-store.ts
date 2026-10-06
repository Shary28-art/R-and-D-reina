import type { Order, OrderPaymentScreenshot, OrderStatus, PaymentStatus, QuoteRequest } from "@/types/order";

/**
 * In-memory order and quote store with state protection and audit logging.
 */
const orders = new Map<string, Order>();
const quotes: QuoteRequest[] = [];
let orderSequenceCounter = 2; // ORD-2026-0001 is seeded below

// Seed sample orders so the demo has pre-populated realistic data including RD-1025 from user specification
const initialOrderRD1025: Order = {
  orderId: "ORD-2026-0001",
  orderNumber: "ORD-2026-0001",
  customer: {
    fullName: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "(555) 349-2810",
    eventDate: "2026-10-24",
    eventLocation: "The Grand Glasshouse, 450 Estate Way, North Hills",
    address: "742 Evergreen Terrace, Suite 100",
    notes: "Please ensure chair cushions are ivory velvet. Delivery window requested between 10am and 12pm.",
  },
  items: [
    {
      productId: "chairs-1",
      name: "Black & Gold Luxury Chair",
      slug: "black-gold-luxury-chair",
      categorySlug: "chairs",
      price: 10,
      quantity: 18,
      eventDate: "2026-10-24",
      image: "https://images.unsplash.com/photo-1519167758481-83bd554da76f?auto=format&fit=crop&w=900&q=80",
    },
    {
      productId: "tables-0",
      name: "Reclaimed Farm Table — 8 ft",
      slug: "reclaimed-farm-table-8-ft",
      categorySlug: "tables",
      price: 85,
      quantity: 2,
      eventDate: "2026-10-24",
      image: "https://images.unsplash.com/photo-1478145787058-4089e6e9a99f?auto=format&fit=crop&w=900&q=80",
    },
    {
      productId: "candles-decor-0",
      name: "Fluted Pillar Candle Trio",
      slug: "fluted-pillar-candle-trio",
      categorySlug: "candles-decor",
      price: 8,
      quantity: 6,
      eventDate: "2026-10-24",
      image: "https://images.unsplash.com/photo-1513542530795-64f4c14d783d?auto=format&fit=crop&w=900&q=80",
    },
  ],
  eventDate: "2026-10-24",
  eventLocation: "The Grand Glasshouse, 450 Estate Way, North Hills",
  subtotal: 398,
  total: 398,
  paymentMethod: "zelle",
  paymentStatus: "pending",
  orderStatus: "Pending Verification",
  paymentScreenshot: {
    filename: "zelle-confirmation-rd1025.png",
    mimeType: "image/png",
    dataUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
  },
  createdAt: "2026-09-14T14:30:00.000Z",
};

// Support RD-1025 alias
orders.set(initialOrderRD1025.orderId, initialOrderRD1025);
orders.set("RD-1025", initialOrderRD1025);

// Seed initial quote requests
quotes.push({
  id: "Q-1001",
  fullName: "Sophia Harrington",
  email: "sophia.h@example.com",
  phone: "(555) 782-9012",
  eventType: "Autumn Garden Wedding",
  eventDate: "2026-11-14",
  eventLocation: "Rosewood Manor, Meadowlands",
  guestCount: "160",
  servicesNeeded: "Custom floral ceremony arch, full stage design with golden pillars, and 160 ghost chairs.",
  budgetRange: "$4,500 – $7,000",
  message: "Looking for an editorial, timeless luxury aesthetic with champagne tones and warm ambient candlelight.",
  createdAt: "2026-09-15T09:15:00.000Z",
});

export function generateOrderNumber(): string {
  const currentYear = new Date().getFullYear();
  const sequence = String(orderSequenceCounter++).padStart(4, "0");
  return `ORD-${currentYear}-${sequence}`;
}

export function generateOrderId(): string {
  return generateOrderNumber();
}

export function saveOrder(order: Order): void {
  orders.set(order.orderId, order);
  if (order.orderNumber && order.orderNumber !== order.orderId) {
    orders.set(order.orderNumber, order);
  }
}

export function getOrder(idOrNumber: string): Order | undefined {
  if (!idOrNumber) return undefined;
  if (orders.has(idOrNumber)) return orders.get(idOrNumber);
  for (const order of orders.values()) {
    if (order.orderNumber === idOrNumber || order.orderId === idOrNumber) {
      return order;
    }
  }
  return undefined;
}

export function getAllOrders(): Order[] {
  const unique = new Map<string, Order>();
  for (const order of orders.values()) {
    unique.set(order.orderId, order);
  }
  return Array.from(unique.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateOrderStatus(orderId: string, status: OrderStatus): boolean {
  const order = getOrder(orderId);
  if (!order) return false;
  order.orderStatus = status;
  return true;
}

export function updatePaymentStatus(orderId: string, status: PaymentStatus): boolean {
  const order = getOrder(orderId);
  if (!order) return false;
  order.paymentStatus = status;
  if (status === "verified") {
    order.orderStatus = "Confirmed";
  }
  return true;
}

export interface VerifyPaymentResult {
  success: boolean;
  order?: Order;
  error?: string;
}

export function verifyPayment(orderId: string, adminUser: string = "Admin"): VerifyPaymentResult {
  const order = getOrder(orderId);
  if (!order) {
    return { success: false, error: `Order #${orderId} not found.` };
  }

  // Double-verification guard
  if (order.paymentStatus === "verified") {
    return {
      success: false,
      error: `Payment for Order #${order.orderNumber || order.orderId} is already verified (by ${order.paymentVerifiedBy || "Admin"} on ${order.paymentVerifiedAt ? new Date(order.paymentVerifiedAt).toLocaleString() : "record"}).`,
    };
  }

  // Guard against verifying a rejected order without a re-uploaded screenshot
  if (order.paymentStatus === "rejected") {
    return {
      success: false,
      error: `Payment for Order #${order.orderNumber || order.orderId} is currently rejected. Customer must submit updated proof of payment first.`,
    };
  }

  order.paymentStatus = "verified";
  order.orderStatus = "Confirmed";
  order.paymentVerifiedAt = new Date().toISOString();
  order.paymentVerifiedBy = adminUser;
  // Clear any previous rejection details
  order.rejectionReason = undefined;
  order.paymentRejectedAt = undefined;
  order.paymentRejectedBy = undefined;

  return { success: true, order };
}

export interface RejectPaymentResult {
  success: boolean;
  order?: Order;
  error?: string;
}

export function rejectPayment(orderId: string, reason: string, adminUser: string = "Admin"): RejectPaymentResult {
  const order = getOrder(orderId);
  if (!order) {
    return { success: false, error: `Order #${orderId} not found.` };
  }

  if (!reason || reason.trim().length === 0) {
    return { success: false, error: "A non-empty rejection reason is required." };
  }

  // Double-rejection guard
  if (order.paymentStatus === "rejected") {
    return {
      success: false,
      error: `Payment for Order #${order.orderNumber || order.orderId} has already been rejected.`,
    };
  }

  // Guard: Cannot reject already verified order directly
  if (order.paymentStatus === "verified") {
    return {
      success: false,
      error: `Payment for Order #${order.orderNumber || order.orderId} has already been verified and confirmed.`,
    };
  }

  order.paymentStatus = "rejected";
  order.orderStatus = "Payment Rejected";
  order.rejectionReason = reason.trim();
  order.paymentRejectedAt = new Date().toISOString();
  order.paymentRejectedBy = adminUser;

  return { success: true, order };
}

export function reuploadPaymentProof(
  orderId: string,
  screenshot: OrderPaymentScreenshot
): { success: boolean; order?: Order; error?: string } {
  const order = getOrder(orderId);
  if (!order) {
    return { success: false, error: `Order #${orderId} not found.` };
  }

  if (order.paymentStatus === "verified") {
    return {
      success: false,
      error: "This order is already verified and confirmed.",
    };
  }

  order.paymentScreenshot = screenshot;
  order.paymentStatus = "pending";
  order.orderStatus = "Pending Verification";
  order.rejectionReason = undefined;
  order.paymentRejectedAt = undefined;
  order.paymentRejectedBy = undefined;

  return { success: true, order };
}

export function saveQuote(quote: QuoteRequest): void {
  quotes.unshift(quote);
}

export function getAllQuotes(): QuoteRequest[] {
  return [...quotes];
}

