"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Find Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#b89150]/20 bg-[#3a161a] text-[#f3ead8]">
      <nav className="mx-auto grid max-w-7xl grid-cols-2 items-center px-6 py-4 md:grid-cols-3 md:px-10">
        {/* Left: Circular Scissors Emblem + Brand Name */}
        <Link href="/" className="flex items-center gap-3.5 justify-self-start">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b89150]/60 text-[#b89150]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </span>
          <div>
            <span className="block font-heading text-xl font-bold uppercase tracking-[0.08em] text-[#f3ead8]">
              {siteConfig.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.24em] text-[#b89150]/90">
              Gentlemen's Barber • Dhod
            </span>
          </div>
        </Link>

        {/* Center: Links */}
        <ul className="hidden items-center justify-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f3ead8]/85 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-[#b89150]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Icon + Sharp Rectangular Gold Button */}
        <div className="flex items-center gap-5 justify-self-end">
          <Link
            href="/services"
            aria-label="Services"
            className="hidden text-[#f3ead8]/80 transition hover:text-[#b89150] sm:inline-block"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>

          <Link
            href="/book"
            className="inline-flex items-center gap-5 bg-[#b89150] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#141110] transition hover:bg-[#caa360]"
          >
            <span>Book a chair</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="text-xl text-[#f3ead8] md:hidden"
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-[#b89150]/20 bg-[#3a161a] px-6 py-4 text-xs uppercase tracking-[0.2em] md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-[#b89150]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}