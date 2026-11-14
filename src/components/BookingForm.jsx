"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";
import { buildUpiLink } from "@/lib/upi";

const MAX_SERVICES = 3;

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
  const [selectedIds, setSelectedIds] = useState([]);
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
  const [showUpload, setShowUpload] = useState(false);
  const [screenshot, setScreenshot] = useState("");

  const selected = selectedIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);
  const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = Math.min(
    60,
    selected.reduce((sum, s) => sum + s.duration_minutes, 0)
  );
  const idsKey = selectedIds.join(",");

  // Bookable dates: today up to 30 days ahead
  useEffect(() => {
    const last = new Date();
    last.setDate(last.getDate() + 30);
    setLimits({ min: toDateString(new Date()), max: toDateString(last) });
  }, []);

  // Load free slots whenever the services or date change
  useEffect(() => {
    if (!idsKey || !date) return;
    let ignore = false;
    const ids = idsKey.split(",").map(Number);

    async function load() {
      setLoadingSlots(true);
      setError("");
      const { data, error } = await supabase.rpc("get_available_slots", {
        p_service_ids: ids,
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
  }, [idsKey, date, refreshKey]);

  function toggleService(id) {
    setTime("");
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SERVICES) return prev;
      return [...prev, id];
    });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 800;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setScreenshot(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const paidOnline =
      e.nativeEvent.submitter?.value === "paid" && Boolean(screenshot);
    setError("");

    setSubmitting(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds: selectedIds,
          date,
          time,
          name,
          phone,
          screenshot: paidOnline ? screenshot : null,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        if (result.error === "slot_taken") {
          setError("Sorry, that slot was just taken. Please choose another time.");
          setTime("");
          setRefreshKey((k) => k + 1);
        } else {
          setError("Something went wrong. Please check your details and try again.");
        }
        setSubmitting(false);
        return;
      }

      setConfirmed({
        items: selected.map((s) => ({ name: s.name, price: s.price })),
        total: result.total ?? totalPrice,
        date,
        time,
        name,
      });
    } catch {
      setError("Network problem. Please try again.");
    }

    setSubmitting(false);
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-white/60 p-8 text-center">
        <h2 className="font-heading text-3xl">Booking received</h2>
        <p className="mt-4 opacity-80">
          Thank you, {confirmed.name}. Your appointment is booked.
        </p>

        <div className="mt-6 space-y-1 text-sm">
          <p>
            <span className="opacity-70">Date:</span> {formatDate(confirmed.date)}
          </p>
          <p>
            <span className="opacity-70">Time:</span> {formatTime(confirmed.time)}
          </p>
        </div>

        <ul className="mx-auto mt-6 max-w-xs space-y-2 text-sm">
          {confirmed.items.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-accent/30 pt-2 text-base font-medium">
            <span>Total</span>
            <span>₹{confirmed.total}</span>
          </li>
        </ul>

        <p className="mt-6 text-sm opacity-80">
          Need to change something? Call {siteConfig.phone}.
        </p>

        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setSelectedIds([]);
            setDate("");
            setTime("");
            setName("");
            setPhone("");
            setShowUpload(false);
            setScreenshot("");
          }}
          className="mt-6 inline-block rounded-full border border-ink px-6 py-2 text-sm transition hover:bg-ink hover:text-paper"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  const upiLink =
    siteConfig.upiId && totalPrice > 0
      ? buildUpiLink(totalPrice, `${siteConfig.name} booking`)
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium">
          1. Choose services{" "}
          <span className="font-normal opacity-60">(up to {MAX_SERVICES})</span>
        </label>

        <div className="space-y-3">
          {services.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            const disabled = !isSelected && selectedIds.length >= MAX_SERVICES;

            return (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleService(s.id)}
                disabled={disabled}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-ink bg-white"
                    : "border-accent/40 bg-white/60 hover:border-ink"
                } ${disabled ? "opacity-40" : ""}`}
              >
                <span>
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className="block text-xs opacity-70">
                    {s.duration_minutes} min
                  </span>
                </span>
                <span className="flex items-center gap-3 text-sm">
                  <span>₹{s.price}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                      isSelected
                        ? "border-ink bg-ink text-paper"
                        : "border-accent/60"
                    }`}
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink px-5 py-3 text-sm text-paper">
            <span>
              {selected.length} selected · {totalDuration} min
            </span>
            <span>Total ₹{totalPrice}</span>
          </div>
        )}

        {selectedIds.length >= MAX_SERVICES && (
          <p className="mt-2 text-xs opacity-70">
            You can add up to {MAX_SERVICES} services per appointment.
          </p>
        )}
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

      {selectedIds.length > 0 && date && (
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

      {time && upiLink && (
        <div className="rounded-2xl border border-accent/40 bg-white/60 p-6 text-center">
          <p className="text-sm font-medium">5. Pay ₹{totalPrice} via UPI</p>
          <div className="mt-4 inline-block rounded-2xl bg-white p-4">
            <QRCodeSVG value={upiLink} size={192} />
          </div>
          <p className="mt-3 text-xs opacity-70">
            Scan with any UPI app, or{" "}
            <a href={upiLink} className="underline hover:text-accent">
              tap here to open UPI app
            </a>
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      {time && (
        <div className="space-y-3">
          {!showUpload ? (
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              disabled={selectedIds.length === 0 || !time || !name || !phone || submitting}
              className="w-full rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
            >
              I've paid, confirm booking
            </button>
          ) : (
            <div className="space-y-3 rounded-2xl border border-accent/40 bg-white/60 p-4">
              <label className="block text-sm font-medium">
                Upload payment screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:text-paper"
              />
              {screenshot && (
                <img
                  src={screenshot}
                  alt="Payment screenshot preview"
                  className="mx-auto max-h-48 rounded-xl border border-accent/40"
                />
              )}
              <button
                type="submit"
                value="paid"
                disabled={!screenshot || submitting}
                className="w-full rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? "Booking…" : "Submit screenshot & confirm booking"}
              </button>
            </div>
          )}

          <button
            type="submit"
            value="salon"
            disabled={selectedIds.length === 0 || !time || !name || !phone || submitting}
            className="w-full rounded-full border border-ink px-6 py-3 text-sm text-ink transition hover:bg-ink hover:text-paper disabled:opacity-40"
          >
            {submitting ? "Booking…" : "Pay at salon"}
          </button>
        </div>
      )}
    </form>
  );
}