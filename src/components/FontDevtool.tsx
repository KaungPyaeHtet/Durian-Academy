"use client";

import { useEffect, useState } from "react";

// Each option maps to a CSS variable registered by next/font in the root layout.
const FONTS = [
  { label: "Lexend", varName: "--font-lexend" },
  { label: "Inter", varName: "--font-inter" },
  { label: "Manrope", varName: "--font-manrope" },
  { label: "Plus Jakarta Sans", varName: "--font-jakarta" },
  { label: "DM Sans", varName: "--font-dm-sans" },
  { label: "Onest", varName: "--font-onest" },
  { label: "Figtree", varName: "--font-figtree" },
  { label: "Work Sans", varName: "--font-work-sans" },
] as const;

const STORAGE_KEY = "dev-font";
const DEFAULT = FONTS[0].varName;

function apply(varName: string) {
  document.documentElement.style.setProperty("--font-active", `var(${varName})`);
}

export default function FontDevtool() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(DEFAULT);

  // Restore the saved choice on mount.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && FONTS.some((f) => f.varName === saved)) {
      // one-time restore from localStorage on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(saved);
      apply(saved);
    }
  }, []);

  // Only surface this tool in development.
  if (process.env.NODE_ENV === "production") return null;

  function select(varName: string) {
    setActive(varName);
    apply(varName);
    localStorage.setItem(STORAGE_KEY, varName);
  }

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}>
      {open && (
        <div
          style={{
            marginBottom: 8,
            width: 220,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#fff",
            boxShadow: "0 12px 32px -12px rgba(0,0,0,0.35)",
            padding: 6,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#666",
              padding: "6px 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Body font
          </div>
          {FONTS.map((f) => {
            const isActive = f.varName === active;
            return (
              <button
                key={f.varName}
                onClick={() => select(f.varName)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontFamily: `var(${f.varName})`,
                  background: isActive ? "#303c18" : "transparent",
                  color: isActive ? "#fbf7ef" : "#222a12",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Switch body font (dev only)"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#303c18",
          color: "#fbf7ef",
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 20px -8px rgba(0,0,0,0.5)",
        }}
      >
        Aa
      </button>
    </div>
  );
}
