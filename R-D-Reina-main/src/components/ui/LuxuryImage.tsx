"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const RELIABLE_FALLBACK =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

export function LuxuryImage({
  src,
  alt,
  fallbackSrc = RELIABLE_FALLBACK,
  className,
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasErrored) {
          setHasErrored(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
