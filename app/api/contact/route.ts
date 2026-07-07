import { sendContactEmail, type ContactEmailPayload } from "@/lib/email/contact";
import { NextResponse } from "next/server";


function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactEmailPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const company = body.company?.trim();
  const service = body.service?.trim();
  const message = body.message?.trim();

  if (!name || !email || !service || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please share a bit more about your project." },
      { status: 400 }
    );
  }

  try {
    const result = await sendContactEmail({
      name,
      email,
      company,
      service,
      message,
    });

    return NextResponse.json({ ok: true, mode: result.mode });
  } catch {
    return NextResponse.json(
      { error: "We could not send your message right now. Please try again later." },
      { status: 500 }
    );
  }
}
