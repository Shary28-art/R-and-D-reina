export type PaymentMethod = "zelle";
export type PaymentStatus = "pending" | "verified" | "rejected" | "verification_pending";
export type OrderStatus =
  | "Pending Verification"
  | "Confirmed"
  | "Payment Rejected"
  | "Completed"
  | "Cancelled"
  | "pending_verification"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  address: string;
  notes?: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  quantity: number;
  eventDate: string;
  image: string;
}

export interface OrderPaymentScreenshot {
  filename: string;
  mimeType: string;
  /** Base64 data URL for storage/preview */
  dataUrl?: string;
}

export interface Order {
  orderId: string;
  orderNumber?: string;
  customer: OrderCustomer;
  items: OrderLineItem[];
  eventDate: string;
  eventLocation: string;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentScreenshot?: OrderPaymentScreenshot;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  paymentRejectedAt?: string;
  paymentRejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestCount: string;
  servicesNeeded: string;
  budgetRange: string;
  message: string;
  attachment?: { filename: string; mimeType: string };
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
