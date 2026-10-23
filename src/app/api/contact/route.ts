import { NextResponse } from "next/server";
import type { ContactMessage } from "@/types/order";
import { notifyContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const msg: ContactMessage = {
      id: `C-${Date.now()}`,
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      subject: String(body.subject ?? ""),
      message: String(body.message ?? ""),
      createdAt: new Date().toISOString(),
    };

    if (!msg.name || !msg.email || !msg.subject || !msg.message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await notifyContactEmail(msg);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
