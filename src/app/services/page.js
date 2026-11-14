import ServicesSection from "@/components/ServicesSection";
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
    <main>
      <ServicesSection services={services ?? []} />
    </main>
  );
}