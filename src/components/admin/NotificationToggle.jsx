"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export default function NotificationToggle() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setSupported(false);
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      setEnabled(Boolean(sub) && Notification.permission === "granted");
    }
    check();
  }, []);

  async function enable() {
    setBusy(true);
    setMsg("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMsg("Notifications are blocked. Allow them in your browser settings for this site.");
        setBusy(false);
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          ),
        });
      }

      const { error } = await supabase
        .from("push_subscriptions")
        .upsert(
          { endpoint: sub.endpoint, subscription: sub.toJSON() },
          { onConflict: "endpoint" }
        );
      if (error) throw error;

      setEnabled(true);
      setMsg("Turned on for this device.");
    } catch (e) {
      console.error(e);
            setMsg("Could not turn on: " + (e?.message || "unknown error"));
    }
    setBusy(false);
  }

  async function disable() {
    setBusy(true);
    setMsg("");
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setEnabled(false);
      setMsg("Turned off for this device.");
    } catch (e) {
      console.error(e);
      setMsg("Could not turn off notifications.");
    }
    setBusy(false);
  }

  if (!supported) {
    return (
      <p className="rounded-2xl border border-accent/40 bg-white/60 p-4 text-sm opacity-80">
        This browser can&apos;t show push notifications. On an iPhone, add this site to
        your Home Screen and open it from there.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-white/60 p-4">
      <div>
        <p className="text-sm font-medium">Booking notifications on this device</p>
        <p className="text-xs opacity-70">
          {enabled ? "On" : "Off"}
          {msg && ` · ${msg}`}
        </p>
      </div>
      <button
        onClick={enabled ? disable : enable}
        disabled={busy}
        className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
      >
        {enabled ? "Turn off" : "Turn on"}
      </button>
    </div>
  );
}