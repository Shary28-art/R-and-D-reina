import { NextResponse } from "next/server";
import type { QuoteRequest } from "@/types/order";
import { notifyQuoteEmail } from "@/lib/email";
import { getAllQuotes, saveQuote } from "@/lib/orders-store";

export async function GET() {
  return NextResponse.json(getAllQuotes());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quote: QuoteRequest = {
      id: `Q-${Date.now()}`,
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      eventType: String(body.eventType ?? ""),
      eventDate: String(body.eventDate ?? ""),
      eventLocation: String(body.eventLocation ?? ""),
      guestCount: String(body.guestCount ?? ""),
      servicesNeeded: String(body.servicesNeeded ?? ""),
      budgetRange: String(body.budgetRange ?? ""),
      message: String(body.message ?? ""),
      createdAt: new Date().toISOString(),
    };

    if (!quote.fullName || !quote.email || !quote.eventDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    saveQuote(quote);
    await notifyQuoteEmail(quote);
    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
