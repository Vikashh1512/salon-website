import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { formatDate, formatTime } from "@/lib/format";
import { sendPush } from "@/lib/notify";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { serviceIds, date, time, name, phone } = body;

  if (
    !Array.isArray(serviceIds) ||
    serviceIds.length < 1 ||
    serviceIds.length > 3 ||
    !date ||
    !time ||
    !name ||
    !phone
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const ids = serviceIds.map(Number);
  if (
    ids.some((n) => !Number.isInteger(n) || n <= 0) ||
    new Set(ids).size !== ids.length
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("create_booking", {
    p_service_ids: ids,
    p_date: date,
    p_time: time,
    p_name: name,
    p_phone: phone,
  });

  if (error) {
    const taken = error.message.includes("no longer available");
    return NextResponse.json(
      { error: taken ? "slot_taken" : "invalid" },
      { status: taken ? 409 : 400 }
    );
  }

  const total = data?.total_price ?? null;

  // The booking is saved. If the alert fails, the customer still succeeds.
  try {
    const { data: services } = await supabase
      .from("services")
      .select("id, name")
      .in("id", ids);

    const names =
      ids
        .map((id) => services?.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(" + ") || "Appointment";

    const when = `${formatDate(date)} at ${formatTime(time)}`;

    await sendPush({
      title: "New booking",
      body: `${name} · ${names} · ₹${total} · ${when}`,
      url: "/admin",
    });
  } catch (e) {
    console.error("Notification failed:", e);
  }

  return NextResponse.json({ ok: true, total });
}