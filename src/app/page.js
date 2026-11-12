import Image from "next/image";
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm uppercase tracking-widest text-accent">
            Hair studio
          </p>
          <h1 className="mt-4 font-heading text-5xl leading-tight md:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-md opacity-80">
            Book your appointment online in under a minute and see all our
            services and prices.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/book">Book appointment</Button>
            <Button href="/services" variant="outline">
              View services
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent/20">
          <Image
            src="/hero.jpg"
            alt="Salon interior"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-heading text-3xl">Our services</h2>

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
      <section className="bg-ink py-16 text-center text-paper">
        <h2 className="font-heading text-3xl">Ready for a fresh look?</h2>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-full bg-paper px-6 py-3 text-sm text-ink transition hover:opacity-90"
        >
          Book now
        </Link>
      </section>
    </main>
  );
}