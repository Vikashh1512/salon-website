import Link from "next/link";
import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })
    .limit(3);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden bg-[#141110] text-[#f3ead8]">
        {/* Right-side hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        {/* Dark vignette fading left-to-right like screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141110] via-[#141110]/90 to-[#141110]/20" />

        {/* Vertical left rail text */}
        <div className="pointer-events-none absolute bottom-10 left-6 z-20 hidden origin-bottom-left -rotate-90 text-[10px] uppercase tracking-[0.32em] text-[#f3ead8]/45 lg:block">
          SIKAR, INDIA / THE ART OF BARBERING
        </div>

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 py-20 md:px-16">
          <div className="max-w-2xl">
            <h1 className="font-heading text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-[5.5rem]">
              <span className="block text-[#f3ead8]">A PROPER CUT.</span>
              <span className="mt-1 block text-[#b89150]">NO SHORTCUTS.</span>
            </h1>

            <div className="mt-7 max-w-md space-y-1.5 text-sm text-[#f3ead8]/80 sm:text-base">
              <p>Old-school craft. A fresh perspective.</p>
              <p>Haircuts, hot towel shaves and good conversation.</p>
              <p>Welcome to your new usual.</p>
            </div>

            {/* Bottom-left side-by-side rectangular buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="inline-flex min-w-[210px] items-center justify-between bg-[#b89150] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#141110] transition hover:bg-[#caa360]"
              >
                <span>Book your chair</span>
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex min-w-[240px] items-center justify-between border border-[#f3ead8]/35 bg-[#141110]/60 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f3ead8] transition hover:border-[#b89150] hover:text-[#b89150]"
              >
                <span>Explore our services</span>
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Circular Orbiting Stamp Badge (Pinned Bottom-Right) */}
        <div className="absolute bottom-6 right-6 z-30 md:bottom-10 md:right-12">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#f3ead8] text-[#141110] shadow-2xl md:h-36 md:w-36">
            {/* Rotating curved text ring */}
            {/* Rotating curved text ring */}
            <div
              className="h-full w-full animate-spin"
              style={{ animationDuration: "14s" }}
            >
              <svg viewBox="0 0 140 140" className="h-full w-full">
                <defs>
                  <path
                    id="orbitTextPath"
                    d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                  />
                </defs>
                <text
                  fill="#141110"
                  fontSize="9"
                  fontWeight="700"
                  letterSpacing="2.2"
                >
                  <textPath href="#orbitTextPath" startOffset="0%">
                    • MODERN GENTLEMEN • TRADITIONAL CRAFT
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Stationary center scissors + location */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-[#141110] md:h-7 md:w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#141110]">
                DHOD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-heading text-3xl uppercase">Our services</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {services?.map((s) => (
            <ServiceCard
              key={s.id}
              name={s.name}
              description={s.description}
              price={s.price}
              duration={s.duration_minutes}
            />
          ))}
        </div>

        {(!services || services.length === 0) && (
          <p className="mt-6 opacity-70">Services coming soon.</p>
        )}

        <div className="mt-10">
          <Button href="/services" variant="outline">
            See all services
          </Button>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-[#141110] py-16 text-center text-[#f3ead8]">
        <h2 className="font-heading text-3xl uppercase">Ready for a fresh look?</h2>
        <Link
          href="/book"
          className="mt-6 inline-flex items-center gap-4 bg-[#b89150] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#141110] transition hover:bg-[#caa360]"
        >
          <span>Book your chair</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}