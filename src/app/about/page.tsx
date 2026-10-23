import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm ring-1 ring-gold/20 shadow-lg">
          <Image
            src="/images/real-event-setup.jpg"
            alt="R&D by Reina luxury event setup with organic balloon arch and backdrop"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="font-serif text-5xl text-charcoal">About R&amp;D by Reina</h1>
          <p className="mt-6 leading-relaxed text-warm-gray">
            R&amp;D by Reina is a luxury event rental and décor studio serving
            weddings, milestone celebrations, corporate gatherings, and intimate
            dinners. We believe the details — the chair at each place setting, the
            glow of a candelabra, the backdrop behind your vows — are what transform
            a room into an experience.
          </p>
          <p className="mt-4 leading-relaxed text-warm-gray">
            Our collection spans seating, tables, linens, glassware, lounge pieces,
            floral focal points, balloon artistry, and full-scale stage design. Every
            reservation is handled with care, clear communication, and respect for
            your timeline.
          </p>
          <Button href="/contact" className="mt-8">
            Get in touch
          </Button>
        </div>
      </div>
    </div>
  );
}
