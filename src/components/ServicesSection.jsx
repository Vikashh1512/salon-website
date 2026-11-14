import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function ServicesSection({ services = [], showAllLink = false }) {
  return (
    <section className="relative bg-paper">
      {/* Vertical text on the far left (desktop only) */}
      <div
        className="pointer-events-none absolute left-5 top-24 hidden text-[10px] uppercase tracking-[0.3em] text-[#3a161a]/50 lg:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        01 / The service menu
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-16 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-24">
        {/* Left: intro */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#3a161a]">
            The chair is yours
          </p>

          <h2 className="mt-8 font-heading text-6xl font-bold uppercase leading-[0.95] tracking-tight text-[#3a161a] md:text-7xl">
            Look sharp.
          </h2>
          <p className="font-serif text-6xl italic leading-none text-[#3a161a] md:text-7xl">
            Feel yourself.
          </p>

          <p className="mt-10 max-w-sm text-base leading-8 text-[#3a161a]/70">
            Fresh cuts, clean shaves and a little time for yourself. Every visit
            starts with a proper chat and ends with the finishing touches done right.
          </p>

          <div className="mt-12 flex items-center gap-5">
            <Link
              href="/book"
              className="flex h-24 w-24 items-center justify-center rounded-full border border-[#3a161a]/40 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3a161a] transition hover:border-[#3a161a] hover:bg-[#3a161a] hover:text-[#f3ead8]"
            >
              Book
            </Link>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3a161a]/70">
              No rush.
              <br />
              Pick a time.
            </p>
          </div>
        </div>

        {/* Right: menu */}
        <div>
          <div className="border-t-2 border-[#3a161a]">
            <div className="flex items-center justify-between border-b border-[#3a161a]/20 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3a161a]">
              <span>{siteConfig.name} / Service menu</span>
              <span>INR</span>
            </div>
          </div>

          {services.length === 0 && (
            <p className="py-8 text-sm text-[#3a161a]/70">Services coming soon.</p>
          )}

          <ul>
            {services.map((s, i) => (
              <li key={s.id} className="border-b border-[#3a161a]/20">
                <Link
                  href={`/book?service=${s.id}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-8 transition hover:bg-[#3a161a]/5"
                >
                  <span className="pt-2 text-xs font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-heading text-3xl font-bold leading-tight text-[#3a161a] transition group-hover:text-accent md:text-4xl">
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="mt-3 max-w-xl text-sm leading-6 text-[#3a161a]/70">
                        {s.description}
                      </p>
                    )}
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3a161a]/60">
                      {s.duration_minutes} minutes
                    </p>
                  </div>

                  <div className="flex items-start gap-5">
                    <span className="font-heading text-3xl font-bold text-[#3a161a] md:text-4xl">
                      ₹{s.price}
                    </span>
                    <span
                      aria-hidden="true"
                      className="pt-2 text-[#3a161a] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {showAllLink && (
            <Link
              href="/services"
              className="mt-8 inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#3a161a] transition hover:text-accent"
            >
              See all services →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}