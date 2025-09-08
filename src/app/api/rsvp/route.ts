import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // basic guard
    if (!body?.name || !body?.phone) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const r = await fetch(process.env.APPS_SCRIPT_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();           // read raw
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* leave as text */ }

    if (!r.ok || json?.ok !== true) {
      return NextResponse.json(
        { ok: false, error: json?.error || "script_error", raw: text },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, family: json.family });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "proxy_error", detail: String(e) }, { status: 500 });
  }
}