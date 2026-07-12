"use client";

import { useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";

export function MarkdownEditor({
  name,
  defaultValue = "",
  rows = 12,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after = before, placeholder = "text") {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = s + before.length;
      ta.selectionEnd = s + before.length + sel.length;
    });
  }

  function prefix(pre: string) {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const next = value.slice(0, lineStart) + pre + value.slice(lineStart);
    setValue(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = s + pre.length;
      ta.selectionStart = ta.selectionEnd = pos;
    });
  }

  const btn =
    "rounded-md px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-leaf-50 hover:text-leaf-700";

  return (
    <div className="rounded-lg border border-leaf-100 bg-white">
      <div className="flex items-center justify-between border-b border-leaf-100 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          <button type="button" className={btn} onClick={() => prefix("## ")} title="Heading">
            H
          </button>
          <button type="button" className={`${btn} font-bold`} onClick={() => wrap("**")} title="Bold">
            B
          </button>
          <button type="button" className={`${btn} italic`} onClick={() => wrap("_")} title="Italic">
            I
          </button>
          <button type="button" className={btn} onClick={() => prefix("- ")} title="Bullet list">
            • List
          </button>
          <button type="button" className={btn} onClick={() => prefix("> ")} title="Quote">
            ❝ Quote
          </button>
        </div>
        <div className="flex items-center gap-0.5 text-xs">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-2.5 py-1 font-semibold capitalize ${
                tab === t ? "bg-leaf-600 text-cream" : "text-ink-soft hover:bg-leaf-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* textarea stays mounted (hidden in preview) so the form still submits it */}
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        placeholder="Write here. Use **bold**, ## headings, - lists…"
        className={`w-full resize-y bg-cream/30 px-3 py-2.5 text-sm text-ink outline-none ${
          tab === "preview" ? "hidden" : ""
        }`}
      />

      {tab === "preview" && (
        <div className="min-h-[8rem] px-3 py-2.5">
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-ink-soft/60">Nothing to preview yet.</p>
          )}
        </div>
      )}

      <p className="border-t border-leaf-100 px-3 py-1.5 text-[11px] text-ink-soft">
        Supports Markdown — <code>**bold**</code>, <code>## heading</code>,{" "}
        <code>- list</code>, <code>&gt; quote</code>. Leave a blank line between
        paragraphs.
      </p>
    </div>
  );
}
