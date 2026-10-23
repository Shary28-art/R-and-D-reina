import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Policies",
};

const sections = [
  {
    title: "Rental duration",
    body: "[PLACEHOLDER] Standard rental periods are typically 24–72 hours unless otherwise noted. Extended rentals may be available upon request.",
  },
  {
    title: "Reservation requirements",
    body: "[PLACEHOLDER] A confirmed reservation requires customer information, event date, and accepted payment terms. Dates are not held until payment requirements are met.",
  },
  {
    title: "Payment requirements",
    body: "[PLACEHOLDER] We accept Zelle for online rental requests. Full or partial payment may be required to confirm inventory. Final balances are due per your invoice.",
  },
  {
    title: "Payment verification",
    body: "[PLACEHOLDER] Zelle payments submitted online remain in Payment Verification Pending status until manually confirmed by R&D by Reina. Uploading a screenshot does not automatically confirm payment.",
  },
  {
    title: "Cancellation policy",
    body: "[PLACEHOLDER] Cancellations made 14+ days before the event may receive a partial credit. Cancellations within 14 days may forfeit deposits. Custom or specialty items may have separate terms.",
  },
  {
    title: "Damage policy",
    body: "[PLACEHOLDER] Renter accepts responsibility for loss or damage beyond normal wear. Repair or replacement fees will be invoiced at fair market value.",
  },
  {
    title: "Late return policy",
    body: "[PLACEHOLDER] Late returns may incur additional day-rate charges. Contact us immediately if your pickup or return window changes.",
  },
  {
    title: "Pickup and delivery",
    body: "[PLACEHOLDER] Client pickup is available by appointment. Delivery and pickup fees are calculated by distance, item volume, and labor.",
  },
  {
    title: "Setup and breakdown",
    body: "[PLACEHOLDER] Setup and breakdown services are available for select items and stage designs. Labor fees apply and must be scheduled in advance.",
  },
  {
    title: "Weather policy",
    body: "[PLACEHOLDER] Outdoor events are subject to weather safety. Rescheduling options will be discussed when severe weather affects setup or guest safety.",
  },
  {
    title: "Cleaning requirements",
    body: "[PLACEHOLDER] Items must be returned free of wax, food debris, and excessive soil unless a cleaning fee was prepaid. Washable linens may incur cleaning charges if returned soiled.",
  },
  {
    title: "Lost or damaged items",
    body: "[PLACEHOLDER] Missing or irreparable items will be billed at replacement cost plus applicable fees.",
  },
];

export default function RentalPoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Rental policies</h1>
      <p className="mt-4 text-sm text-warm-gray">
        Sections marked <strong>[PLACEHOLDER]</strong> should be replaced with
        R&amp;D by Reina&apos;s official policies.
      </p>
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-2xl text-charcoal">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-warm-gray">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
