import { NextResponse } from "next/server";
import { getOrder, reuploadPaymentProof } from "@/lib/orders-store";
import { notifyOrderEmails } from "@/lib/email";
import type { OrderPaymentScreenshot } from "@/types/order";

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const order = getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { paymentScreenshot, ...safe } = order;
  return NextResponse.json({
    ...safe,
    paymentScreenshot: paymentScreenshot
      ? {
          filename: paymentScreenshot.filename,
          mimeType: paymentScreenshot.mimeType,
          dataUrl: paymentScreenshot.dataUrl,
        }
      : undefined,
  });
}

/**
 * Allows a customer whose payment was rejected to re-upload payment proof
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "verified") {
      return NextResponse.json(
        { error: "This order is already verified and confirmed." },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const screenshot = form.get("screenshot");

    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return NextResponse.json(
        { error: "A valid image screenshot file is required." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const dataUrl = `data:${screenshot.type};base64,${buffer.toString("base64")}`;
    const paymentScreenshot: OrderPaymentScreenshot = {
      filename: screenshot.name,
      mimeType: screenshot.type,
      dataUrl,
    };

    const result = reuploadPaymentProof(orderId, paymentScreenshot);
    if (!result.success || !result.order) {
      return NextResponse.json({ error: result.error || "Could not re-upload proof" }, { status: 400 });
    }

    // Re-notify admin so they know customer uploaded a replacement screenshot
    await notifyOrderEmails(result.order);

    const { paymentScreenshot: _ps, ...safeOrder } = result.order;
    return NextResponse.json({
      ok: true,
      message: "Payment proof successfully re-uploaded. Our team will re-review your payment.",
      order: safeOrder,
    });
  } catch {
    return NextResponse.json({ error: "Re-upload failed" }, { status: 500 });
  }
}

