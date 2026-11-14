import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className=" bg-[#3a161a] text-[#f3ead8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm sm:grid-cols-3 md:px-10">
        <div>
          <p className="font-heading text-xl font-bold uppercase tracking-[0.08em] text-[#f3ead8]">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#b89150]">
            {siteConfig.tagline}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[#f3ead8]/75">
            {siteConfig.address}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b89150]">
            Opening Hours
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-[#f3ead8]/80">
            {siteConfig.hours.map((h) => (
              <li key={h.day}>
                <span className="font-medium text-[#f3ead8]">{h.day}:</span>{" "}
                {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b89150]">
            Connect
          </p>
          <ul className="mt-3 space-y-2 text-xs text-[#f3ead8]/80">
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                className="transition hover:text-[#b89150]"
              >
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#b89150]"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#b89150]"
              >
                Instagram
              </a>
            </li>
            <li className="pt-2">
              <Link
                href="/admin"
                className="text-[11px] uppercase tracking-[0.18em] text-[#f3ead8]/45 transition hover:text-[#b89150]"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#b89150]/15 py-4 text-center text-[11px] uppercase tracking-[0.18em] text-[#f3ead8]/50">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}