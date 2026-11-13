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

  const { serviceId, date, time, name, phone } = body;

  if (!serviceId || !date || !time || !name || !phone) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { error } = await supabase.rpc("create_booking", {
    p_service_id: Number(serviceId),
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

  // The booking is saved. If the alert fails, the customer still succeeds.
  try {
    const { data: service } = await supabase
      .from("services")
      .select("name")
      .eq("id", Number(serviceId))
      .single();

    const serviceName = service?.name ?? "Appointment";
    const when = `${formatDate(date)} at ${formatTime(time)}`;

    await sendPush({
      title: "New booking",
      body: `${name} · ${serviceName} · ${when}`,
      url: "/admin",
    });
  } catch (e) {
    console.error("Notification failed:", e);
  }

  return NextResponse.json({ ok: true });
}