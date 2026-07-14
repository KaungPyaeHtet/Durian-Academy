"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  /** Zero-based index; rendered as 01, 02, … when no logo is available. */
  index: number;
};

/**
 * Renders an official curriculum logo, falling back to the numbered badge
 * (e.g. "01") if the image is missing or fails to load.
 */
export default function ProgramLogo({ src, alt, index }: Props) {
  const [failed, setFailed] = useState(false);
  const showLogo = src && !failed;

  if (showLogo) {
    return (
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-leaf-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-leaf-50 font-display text-lg font-semibold tabular-nums text-leaf-600 transition-colors group-hover:bg-leaf-600 group-hover:text-cream">
      0{index + 1}
    </span>
  );
}
