"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LuxuryImage } from "@/components/ui/LuxuryImage";

export function ProductGallery({
  images,
  alt,
  containImage = false,
}: {
  images: string[];
  alt: string;
  containImage?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const isZoomable = !containImage;

  return (
    <div>
      <button
        type="button"
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-champagne/30 ring-1 ring-black/10",
          isZoomable && (zoom ? "cursor-zoom-out" : "cursor-zoom-in"),
        )}
        onClick={() => isZoomable && setZoom((z) => !z)}
        aria-label={isZoomable ? (zoom ? "Zoom out image" : "Zoom in image") : "Product image"}
      >
        <LuxuryImage
          src={images[active]}
          alt={alt}
          fill
          className={cn(
            containImage ? "object-contain" : "object-cover",
            containImage && "p-8",
            "transition duration-300",
            isZoomable && zoom && "scale-125",
          )}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </button>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden rounded-sm ring-2 ring-transparent bg-champagne/20",
              i === active && "ring-gold",
            )}
          >
            <LuxuryImage src={src} alt="" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}
