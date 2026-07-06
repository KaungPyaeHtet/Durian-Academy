import Image from "next/image";
import { site } from "@/lib/site";

// Uses the exact background-removed logo file as provided (no trimming/processing).
const MARK_W = 480;
const MARK_H = 480;
const WORD_W = 1579;
const WORD_H = 534;

export function LogoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  // `size` is the rendered height; width follows the true aspect ratio.
  const height = size;
  const width = Math.round((size * MARK_W) / MARK_H);
  return (
    <Image
      src="/brand/logo bg remove.png"
      alt={`${site.name} logo`}
      width={width}
      height={height}
      priority
      className={className}
      style={{ width: "auto", height: "auto", maxHeight: size, objectFit: "contain" }}
    />
  );
}

export function Wordmark({
  className,
  width = 160,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Image
      src="/brand/wordmark-make-it-bold.png"
      alt="make it bold"
      width={width}
      height={Math.round((width * WORD_H) / WORD_W)}
      className={className}
    />
  );
}
