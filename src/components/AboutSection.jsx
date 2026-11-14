import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#3a161a] text-[#f3ead8]">
      <div className="grid lg:min-h-[720px] lg:grid-cols-2">
        {/* Photo */}
        <div className="relative min-h-[380px] bg-[#241315]">
          <Image
            src={siteConfig.aboutImage}
            alt={`Inside ${siteConfig.name}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#141110]/80 to-transparent" />
          <p className="absolute bottom-6 left-6 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f3ead8]">
            Every detail counts.
          </p>
        </div>

        {/* Text card */}
        <div className="relative flex items-center px-6 py-14 lg:px-0 lg:py-20">
          <div className="relative z-10 w-full border border-[#b89150]/60 bg-[#3a161a] p-8 shadow-2xl md:p-14 lg:-ml-16 lg:max-w-[640px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b89150]">
              Your local barber. A timeless craft.
            </p>

            <h2 className="mt-7 font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight text-[#f3ead8] md:text-6xl">
              Made with care,
            </h2>
            <p className="font-serif text-5xl italic leading-none text-[#b89150] md:text-6xl">
              one cut at a time.
            </p>

            <p className="mt-8 text-base leading-8 text-[#f3ead8]/80">
              We think a trip to the barber should feel unhurried. Sit back, tell us
              what you have in mind, and leave looking sharp and feeling like yourself.
            </p>
            <p className="mt-5 text-base leading-8 text-[#f3ead8]/80">
              Traditional techniques, a modern eye and honest advice. Come in once,
              and we hope our chair becomes your regular.
            </p>

            <p className="mt-10 font-serif text-3xl italic text-[#b89150]">
              Yours, {siteConfig.name}
            </p>

            <div className="mt-8 border-t border-[#f3ead8]/15 pt-6">
              <Link
                href="/book"
                className="inline-flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f3ead8] transition hover:text-[#b89150]"
              >
                <span>Book your chair</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          {/* Vertical text on the far right (desktop only) */}
          <div
            className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] text-[#f3ead8]/35 lg:block"
            style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
          >
            02 / A little about us
          </div>
        </div>
      </div>
    </section>
  );
}