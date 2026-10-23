import { NextResponse } from "next/server";
import { getOrder, verifyPayment, rejectPayment } from "@/lib/orders-store";
import { sendPaymentVerifiedEmail, sendPaymentRejectedEmail } from "@/lib/email";

function isAuthorized(request: Request, bodyKey?: string): boolean {
  const secret = process.env.ADMIN_SECRET_KEY || "reina-admin-2026";
  const headerKey =
    request.headers.get("x-admin-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (headerKey && headerKey.trim() === secret.trim()) {
    return true;
  }
  if (bodyKey && bodyKey.trim() === secret.trim()) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, action, reason, adminUser = "Reina Admin", adminKey } = body;

    // Strict server-side authorization
    if (!isAuthorized(request, adminKey)) {
      return NextResponse.json(
        { error: "Unauthorized. Valid administrator passcode required." },
        { status: 401 }
      );
    }

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
    }

    const currentOrder = getOrder(orderId);
    if (!currentOrder) {
      return NextResponse.json({ error: `Order #${orderId} not found.` }, { status: 404 });
    }

    if (action === "verify") {
      const result = verifyPayment(orderId, adminUser);
      if (!result.success || !result.order) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      // Automatically dispatch verification email to the customer
      const emailResult = await sendPaymentVerifiedEmail(result.order);

      return NextResponse.json({
        ok: true,
        action: "verified",
        order: result.order,
        emailSent: emailResult.success,
        message: `Payment for Order #${result.order.orderNumber || result.order.orderId} verified successfully and confirmation email sent.`,
      });
    }

    if (action === "reject") {
      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        return NextResponse.json(
          { error: "A clear rejection reason is required so the customer can correct their payment." },
          { status: 400 }
        );
      }

      const result = rejectPayment(orderId, reason, adminUser);
      if (!result.success || !result.order) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      // Automatically dispatch rejection email to customer
      const emailResult = await sendPaymentRejectedEmail(result.order, reason.trim());

      return NextResponse.json({
        ok: true,
        action: "rejected",
        order: result.order,
        emailSent: emailResult.success,
        message: `Payment for Order #${result.order.orderNumber || result.order.orderId} marked as rejected. Notification email sent to customer.`,
      });
    }

    return NextResponse.json({ error: `Invalid action '${action}'. Expected 'verify' or 'reject'.` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error processing payment verification." },
      { status: 500 }
    );
  }
}
