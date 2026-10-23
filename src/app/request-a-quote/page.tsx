import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Tell us about your event for a custom rental quote.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Request a quote</h1>
      <p className="mt-4 text-warm-gray">
        Share your vision, date, and guest count — we&apos;ll respond with tailored
        recommendations and pricing.
      </p>
      <div className="mt-10">
        <QuoteForm />
      </div>
    </div>
  );
}
