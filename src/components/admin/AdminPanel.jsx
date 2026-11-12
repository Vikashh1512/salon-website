"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingsAdmin from "./BookingsAdmin";
import ServicesAdmin from "./ServicesAdmin";

const inputClass =
  "w-full rounded-xl border border-accent/40 bg-white/60 px-4 py-3 text-sm outline-none focus:border-accent";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Wrong email or password.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="font-heading text-3xl">Admin login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
        required
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("bookings");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <p className="py-16 text-center text-sm opacity-70">Loading…</p>;
  }

  if (!session) return <LoginForm />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl md:text-4xl">Admin</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-full border border-ink px-5 py-2 text-sm transition hover:bg-ink hover:text-paper"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-2 border-b border-accent/30">
        {["bookings", "services"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm capitalize ${
              tab === t ? "border-ink" : "border-transparent opacity-60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "bookings" ? <BookingsAdmin /> : <ServicesAdmin />}
      </div>
    </div>
  );
}