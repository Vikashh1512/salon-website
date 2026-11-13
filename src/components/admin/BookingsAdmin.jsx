"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toDateString, formatTime, formatDate } from "@/lib/format";

const filters = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
];

const statusStyles = {
  pending: "bg-accent/20 text-ink",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function BookingsAdmin() {
  const [filter, setFilter] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      const today = toDateString(new Date());

      let query = supabase
        .from("bookings")
        .select(
          "id, customer_name, phone, booking_date, start_time, end_time, status, total_price, payment_screenshot, services(name), booking_items(service_name, price)"
        );

      if (filter === "today") query = query.eq("booking_date", today);
      else if (filter === "upcoming") query = query.gte("booking_date", today);
      else if (filter === "past") query = query.lt("booking_date", today);

      const asc = filter !== "past";
      const { data, error } = await query
        .order("booking_date", { ascending: asc })
        .order("start_time", { ascending: asc });

      if (ignore) return;
      if (error) {
        setError("Could not load bookings.");
        setBookings([]);
      } else {
        setBookings(data);
      }
      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, [filter, reloadKey]);

  async function setStatus(id, status) {
    setError("");
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) setError("Could not update the booking.");
    else setReloadKey((k) => k + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filter === f.key
                ? "border-ink bg-ink text-paper"
                : "border-accent/50 hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="mt-6 text-sm opacity-70">Loading bookings…</p>}
      {!loading && bookings.length === 0 && !error && (
        <p className="mt-6 text-sm opacity-70">No bookings here.</p>
      )}

      <div className="mt-6 space-y-4">
        {bookings.map((b) => {
          const digits = b.phone.replace(/\D/g, "");
          const waNumber = digits.length === 10 ? `91${digits}` : digits;

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-accent/40 bg-white/60 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-lg">{b.customer_name}</p>
                  <p className="text-sm opacity-70">
                    {b.booking_items?.length
                      ? b.booking_items.map((i) => i.service_name).join(" + ")
                      : b.services?.name}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs capitalize ${statusStyles[b.status]}`}
                >
                  {b.status}
                </span>
              </div>

              <p className="mt-3 text-sm">
                {formatDate(b.booking_date)} · {formatTime(b.start_time)} –{" "}
                {formatTime(b.end_time)}
              </p>

              {b.total_price != null && (
                <p className="mt-1 text-sm font-medium">
                  Total: ₹{b.total_price} ·{" "}
                  <span className="font-normal opacity-70">
                    {b.payment_screenshot ? "Paid via UPI" : "Pay at salon"}
                  </span>
                </p>
              )}

              {b.payment_screenshot && (
                <div className="mt-3">
                  <p className="mb-1 text-xs opacity-70">Payment screenshot:</p>
                  <img
                    src={b.payment_screenshot}
                    alt="Payment screenshot"
                    className="max-h-56 rounded-xl border border-accent/40"
                  />
                </div>
              )}
              {b.payment_screenshot && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-accent hover:underline">
                    View payment screenshot
                  </summary>
                  <img
                    src={b.payment_screenshot}
                    alt="Payment screenshot"
                    className="mt-2 max-h-64 rounded-xl border border-accent/40"
                  />
                </details>
              )}

              <p className="mt-1 text-sm">
                <a href={`tel:${b.phone}`} className="hover:text-accent">
                  {b.phone}
                </a>
                {" · "}
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  WhatsApp
                </a>
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {b.status !== "confirmed" && b.status !== "cancelled" && (
                  <button
                    onClick={() => setStatus(b.id, "confirmed")}
                    className="rounded-full bg-ink px-4 py-2 text-xs text-paper transition hover:opacity-90"
                  >
                    Confirm
                  </button>
                )}
                {b.status !== "cancelled" && (
                  <button
                    onClick={() => setStatus(b.id, "cancelled")}
                    className="rounded-full border border-ink px-4 py-2 text-xs transition hover:bg-ink hover:text-paper"
                  >
                    Cancel
                  </button>
                )}
                {b.status === "cancelled" && (
                  <button
                    onClick={() => setStatus(b.id, "pending")}
                    className="rounded-full border border-ink px-4 py-2 text-xs transition hover:bg-ink hover:text-paper"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}