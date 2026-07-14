type IconProps = { className?: string };

export function DurianMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" className="fill-leaf-600" />
      {/* spiky durian silhouette */}
      <path
        d="M16 6l1.7 3.2 3.4-1.1-1.1 3.4L23.2 16l-3.2 1.7 1.1 3.4-3.4-1.1L16 23.2l-1.7-3.2-3.4 1.1 1.1-3.4L8.8 16l3.2-1.7-1.1-3.4 3.4 1.1L16 6z"
        className="fill-gold-400"
      />
      <circle cx="16" cy="16" r="2.4" className="fill-leaf-700" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

export function MessengerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8l3.13 3.259L19.752 8l-6.559 6.963z" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.5 2h-3v13.4a2.7 2.7 0 11-2.1-2.63V9.7A6 6 0 1017.4 15.4V8.53a7 7 0 004.1 1.32V6.78a3.9 3.9 0 01-2.9-1.32A3.9 3.9 0 0116.5 2z" />
    </svg>
  );
}

const paths: Record<string, string> = {
  academic:
    "M12 3L2 8l10 5 8-4v6h2V8L12 3zm0 12L5 11.5V15c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.5L12 15z",
  group:
    "M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  book:
    "M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM8 4h8v7l-4-2-4 2V4z",
  trophy:
    "M18 4V2H6v2H2v3a5 5 0 004.58 4.98A6 6 0 0011 15.9V18H7v2h10v-2h-4v-2.1a6 6 0 004.42-3.92A5 5 0 0022 7V4h-4zM4 7V6h2v3.83A3 3 0 014 7zm16 0a3 3 0 01-2 2.83V6h2v1z",
  spark:
    "M12 2l2.09 6.26L20 9l-5 4 1.5 6L12 15.5 7.5 19 9 13 4 9l5.91-.74L12 2z",
};

export function Icon({ name, className }: IconProps & { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  );
}
