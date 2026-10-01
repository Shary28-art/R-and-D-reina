import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Contact</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <ContactForm />
        </div>
        <div className="space-y-8 text-sm text-warm-gray">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Phone
            </h2>
            <a href="tel:972-920-6561" className="mt-2 block text-lg font-medium text-charcoal hover:text-gold transition">
              972-920-6561
            </a>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Email
            </h2>
            <a
              href="mailto:rdbyreina@gmail.com"
              className="mt-2 block text-lg font-medium text-charcoal hover:text-gold transition"
            >
              rdbyreina@gmail.com
            </a>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Hours
            </h2>
            <p className="mt-2">Monday – Saturday, 9:00 AM – 6:00 PM</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Service area
            </h2>
            <p className="mt-2">
              Greater metropolitan area and surrounding counties. Delivery and setup
              fees vary by location — ask for a quote.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Studio &amp; Warehouse Location
            </h2>
            <p className="mt-2 text-base font-medium text-charcoal">
              502 Periwinkle Dr, Mansfield, TX 76063
            </p>
            <p className="mt-1 text-xs text-warm-gray">
              Client consultations and warehouse pickups available by appointment.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal">
              Social Media
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a
                href="https://www.instagram.com/decorbyreina"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition flex items-center gap-2"
              >
                <span className="font-semibold text-charcoal">Instagram:</span>
                <span>Reina &amp; Decor by Reina</span>
              </a>
              <a
                href="https://www.tiktok.com/@decorbyreina"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition flex items-center gap-2"
              >
                <span className="font-semibold text-charcoal">TikTok:</span>
                <span>@decorbyreina</span>
              </a>
              <a
                href="https://www.facebook.com/search/top?q=Rentals%20%26%20Decor%20by%20Reina"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition flex items-center gap-2"
              >
                <span className="font-semibold text-charcoal">Facebook:</span>
                <span>Rentals &amp; Decor by Reina</span>
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-sm border border-black/10 bg-champagne/20 shadow-sm">
            <iframe
              title="R&D by Reina Location Map"
              src="https://maps.google.com/maps?q=502+periwinkle+dr+mansfield+tx+76063&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-56 w-full border-0"
              loading="lazy"
              allowFullScreen
            />
            <div className="flex items-center justify-between p-3 text-xs bg-white">
              <span className="text-charcoal font-medium">502 Periwinkle Dr, Mansfield, TX 76063</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=502+Periwinkle+Dr,+Mansfield,+TX+76063"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gold underline hover:text-charcoal"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
