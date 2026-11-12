"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-accent/40 bg-white/60 px-3 py-2 text-sm outline-none focus:border-accent";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs opacity-70">{label}</span>
      {children}
    </label>
  );
}

function ServiceRow({ service }) {
  const [form, setForm] = useState({
    name: service.name,
    description: service.description ?? "",
    price: service.price,
    duration_minutes: service.duration_minutes,
    is_active: service.is_active,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function change(field, value) {
    setForm({ ...form, [field]: value });
    setMsg("");
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("services")
      .update({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        duration_minutes: Number(form.duration_minutes),
        is_active: form.is_active,
      })
      .eq("id", service.id);
    setSaving(false);
    setMsg(error ? "Could not save" : "Saved");
  }

  return (
    <div className="rounded-2xl border border-accent/40 bg-white/60 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Description">
          <input
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Price (₹)">
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => change("price", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            min="5"
            step="5"
            value={form.duration_minutes}
            onChange={(e) => change("duration_minutes", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => change("is_active", e.target.checked)}
          />
          Visible on website
        </label>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm opacity-70">{msg}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("id", { ascending: true });
      if (ignore) return;
      if (error) setError("Could not load services.");
      else setServices(data);
      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function addService(e) {
    e.preventDefault();
    setAdding(true);
    setError("");
    const { error } = await supabase.from("services").insert({
      name: newService.name.trim(),
      description: newService.description.trim() || null,
      price: Number(newService.price),
      duration_minutes: Number(newService.duration_minutes),
    });
    setAdding(false);
    if (error) {
      setError("Could not add the service. Is the name already used?");
      return;
    }
    setNewService({ name: "", description: "", price: "", duration_minutes: "" });
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={addService}
        className="rounded-2xl border border-dashed border-accent p-5"
      >
        <h2 className="font-heading text-xl">Add a service</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Description">
            <input
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              min="0"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Duration (minutes)">
            <input
              type="number"
              min="5"
              step="5"
              value={newService.duration_minutes}
              onChange={(e) =>
                setNewService({ ...newService, duration_minutes: e.target.value })
              }
              className={inputClass}
              required
            />
          </Field>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={adding}
          className="mt-4 rounded-full bg-ink px-5 py-2 text-sm text-paper transition hover:opacity-90 disabled:opacity-40"
        >
          {adding ? "Adding…" : "Add service"}
        </button>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-sm opacity-70">Loading services…</p>}
        {services.map((s) => (
          <ServiceRow key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}