import { NextResponse } from "next/server";
import type { Order, OrderLineItem } from "@/types/order";
import { generateOrderId, saveOrder } from "@/lib/orders-store";
import { notifyOrderEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const customerRaw = form.get("customer");
    const itemsRaw = form.get("items");
    const totalRaw = form.get("total");
    const screenshot = form.get("screenshot");

    if (
      typeof customerRaw !== "string" ||
      typeof itemsRaw !== "string" ||
      typeof totalRaw !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const customer = JSON.parse(customerRaw);
    const items = JSON.parse(itemsRaw) as OrderLineItem[];
    const total = Number(totalRaw);

    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return NextResponse.json(
        { error: "A screenshot of your confirmed Zelle payment is required to complete your order." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    const dataUrl = `data:${screenshot.type};base64,${buffer.toString("base64")}`;
    const paymentScreenshot: Order["paymentScreenshot"] = {
      filename: screenshot.name,
      mimeType: screenshot.type,
      dataUrl,
    };

    const orderNumber = generateOrderId();

    const order: Order = {
      orderId: orderNumber,
      orderNumber,
      customer,
      items,
      eventDate: customer.eventDate,
      eventLocation: customer.eventLocation,
      subtotal: total,
      total,
      paymentMethod: "zelle",
      paymentStatus: "pending",
      orderStatus: "Pending Verification",
      paymentScreenshot,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    const emailResult = await notifyOrderEmails(order);

    const { paymentScreenshot: _ps, ...clientOrder } = order;
    return NextResponse.json({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      order: clientOrder,
      emailDelivered: emailResult.businessResult.success,
      emailRecipient: process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com",
    });
  } catch {
    return NextResponse.json({ error: "Order submission failed" }, { status: 500 });
  }
}
