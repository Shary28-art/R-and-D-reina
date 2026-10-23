import { NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus, updatePaymentStatus, getOrder, verifyPayment, rejectPayment } from "@/lib/orders-store";
import type { OrderStatus, PaymentStatus } from "@/types/order";
import { sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from "@/lib/email";

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET_KEY || "reina-admin-2026";
  const headerKey =
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(headerKey && headerKey.trim() === secret.trim());
}

export async function GET(request: Request) {
  const orders = getAllOrders();
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus, orderStatus, rejectionReason, adminUser = "Reina Admin" } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If changing payment status, require authorization
    if (paymentStatus) {
      if (!isAuthorized(request) && body.adminKey !== (process.env.ADMIN_SECRET_KEY || "reina-admin-2026")) {
        return NextResponse.json(
          { error: "Unauthorized: Valid admin passcode required to alter payment status." },
          { status: 401 }
        );
      }

      if (paymentStatus === "verified") {
        const vResult = verifyPayment(orderId, adminUser);
        if (!vResult.success) {
          return NextResponse.json({ error: vResult.error }, { status: 400 });
        }
        await sendPaymentVerifiedEmail(vResult.order!);
      } else if (paymentStatus === "rejected") {
        const rReason = rejectionReason || "Payment screenshot could not be verified with Zelle transaction records.";
        const rResult = rejectPayment(orderId, rReason, adminUser);
        if (!rResult.success) {
          return NextResponse.json({ error: rResult.error }, { status: 400 });
        }
        await sendPaymentRejectedEmail(rResult.order!, rReason);
      } else {
        updatePaymentStatus(orderId, paymentStatus as PaymentStatus);
      }
    }

    if (orderStatus && !paymentStatus) {
      updateOrderStatus(orderId, orderStatus as OrderStatus);
    }

    const updated = getOrder(orderId);
    return NextResponse.json({ ok: true, order: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

