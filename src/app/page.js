import Button from "@/components/Button";
import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-heading text-5xl">Beauty, simply done.</h1>
      <p className="mt-4 max-w-md opacity-80">
        Test page for the design foundation.
      </p>

      <div className="mt-8 flex gap-4">
        <Button href="/book">Book appointment</Button>
        <Button href="/services" variant="outline">View services</Button>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        <ServiceCard name="Haircut" price="500" duration="45" />
        <ServiceCard name="Hair Colour" price="2500" duration="120" />
        <ServiceCard name="Hair Spa" price="1200" duration="60" />
      </div>
    </main>
  );
}