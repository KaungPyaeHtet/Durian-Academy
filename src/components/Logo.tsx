import Image from "next/image";
import { site } from "@/lib/site";

export function LogoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt={`${site.name} logo`}
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}

export function Wordmark({
  className,
  width = 150,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Image
      src="/brand/wordmark-make-it-bold.png"
      alt="make it bold"
      width={width}
      height={Math.round((width * 740) / 2000)}
      className={className}
    />
  );
}
