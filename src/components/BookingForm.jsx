"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";

function formatTime(t) {
  const [h, m] = t.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

function formatDate(d) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDateString(date) {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

const inputClass =
  "w-full rounded-xl border border-accent/40 bg-white/60 px-4 py-3 text-sm outline-none focus:border-accent";

export default function BookingForm({ services }) {
  const [limits, setLimits] = useState({ min: "", max: "" });
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const service = services.find((s) => String(s.id) === serviceId);

  // Bookable dates: today up to 30 days ahead
  useEffect(() => {
    const last = new Date();
    last.setDate(last.getDate() + 30);
    setLimits({ min: toDateString(new Date()), max: toDateString(last) });
  }, []);

  // Load free slots whenever the service or date changes
  useEffect(() => {
    if (!serviceId || !date) return;
    let ignore = false;

    async function load() {
      setLoadingSlots(true);
      setError("");
      const { data, error } = await supabase.rpc("get_available_slots", {
        p_service_id: Number(serviceId),
        p_date: date,
      });
      if (ignore) return;
      if (error) {
        setSlots([]);
        setError("Could not load time slots. Please try again.");
      } else {
        setSlots(data.map((row) => row.slot_time));
      }
      setLoadingSlots(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, [serviceId, date, refreshKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.rpc("create_booking", {
      p_service_id: Number(serviceId),
      p_date: date,
      p_time: time,
      p_name: name,
      p_phone: phone,
    });

    setSubmitting(false);

    if (error) {
      if (error.message.includes("no longer available")) {
        setError("Sorry, that slot was just taken. Please choose another time.");
        setTime("");
        setRefreshKey((k) => k + 1);
      } else {
        setError("Something went wrong. Please check your details and try again.");
      }
      return;
    }

    setConfirmed({ service: service.name, date, time, name });
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-white/60 p-8 text-center">
        <h2 className="font-heading text-3xl">Booking received</h2>
        <p className="mt-4 opacity-80">
          Thank you, {confirmed.name}. Your appointment is booked.
        </p>
        <div className="mt-6 space-y-1 text-sm">
          <p><span className="opacity-70">Service:</span> {confirmed.service}</p>
          <p><span className="opacity-70">Date:</span> {formatDate(confirmed.date)}</p>
          <p><span className="opacity-70">Time:</span> {formatTime(confirmed.time)}</p>
        </div>
        <p className="mt-6 text-sm opacity-80">
          Payment is made at the salon via UPI. Need to change something? Call{" "}
          {siteConfig.phone}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium">1. Choose a service</label>
        <select
          value={serviceId}
          onChange={(e) => {
            setServiceId(e.target.value);
            setTime("");
          }}
          className={inputClass}
          required
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.duration_minutes} min · ₹{s.price}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">2. Choose a date</label>
        <input
          type="date"
          value={date}
          min={limits.min}
          max={limits.max}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          className={inputClass}
          required
        />
      </div>

      {serviceId && date && (
        <div>
          <label className="mb-2 block text-sm font-medium">3. Choose a time</label>
          {loadingSlots ? (
            <p className="text-sm opacity-70">Loading available times…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm opacity-70">
              No slots available on this day. Please try another date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    time === t
                      ? "border-ink bg-ink text-paper"
                      : "border-accent/50 hover:border-ink"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {time && (
        <div className="space-y-4">
          <label className="block text-sm font-medium">4. Your details</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
            minLength={2}
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            required
            pattern="[0-9+\s\-]{10,15}"
            title="Enter a valid phone number"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!time || !name || !phone || submitting}
        className="w-full rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
      >
        {submitting ? "Booking…" : "Confirm booking"}
      </button>
    </form>
  );
}