import ServiceCard from "@/components/ServiceCard";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-4xl md:text-5xl">Our services</h1>
      <p className="mt-4 max-w-xl opacity-80">
        Choose a service and book your slot online. Payment is made at the
        salon via UPI.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="mt-12">
        <Button href="/book">Book appointment</Button>
      </div>
    </main>
  );
}