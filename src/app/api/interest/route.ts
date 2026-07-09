import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  message?: string;
  // honeypot — real users never fill this
  website?: string;
};

const MAX = { name: 100, email: 150, phone: 40, program: 60, message: 1500 };

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    console.error("DISCORD_WEBHOOK_URL is not set");
    return NextResponse.json(
      { error: "Form is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bot trap: if the hidden field is filled, silently accept and drop.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const program = clean(body.program, MAX.program);
  const message = clean(body.message, MAX.message);

  if (!name || (!email && !phone)) {
    return NextResponse.json(
      { error: "Please provide your name and at least one way to reach you." },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address looks invalid." },
      { status: 400 },
    );
  }

  const fields = [
    { name: "Name", value: name, inline: true },
    { name: "Program", value: program || "—", inline: true },
    { name: "Email", value: email || "—", inline: true },
    { name: "Phone", value: phone || "—", inline: true },
    { name: "Message", value: message || "—", inline: false },
  ];

  const discordBody = {
    username: "Durian Academy — Website",
    embeds: [
      {
        title: "📩 New enrolment interest",
        color: 0x303c18, // brand olive
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: "Submitted via durianacademy.com" },
      },
    ],
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordBody),
    });

    if (!res.ok) {
      console.error("Discord webhook failed:", res.status, await res.text());
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Discord webhook error:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
