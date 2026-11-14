import BookingForm from "@/components/BookingForm";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Book appointment" };

export default async function BookPage({ searchParams }) {
  const params = await searchParams;
  const initialServiceId = Number(params?.service) || null;

  const { data: services } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes")
    .eq("is_active", true)
    .order("price", { ascending: true });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-4xl md:text-5xl">Book an appointment</h1>
      <p className="mt-4 mb-10 opacity-80">
        Pick a service, a date and a time. You can pay now with UPI or at the salon.
      </p>
      <BookingForm
        services={services ?? []}
        initialServiceId={initialServiceId}
      />
    </main>
  );
}