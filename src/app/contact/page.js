import { siteConfig } from "@/lib/siteConfig";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const phoneLink = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-heading text-4xl md:text-5xl">Visit us</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <div className="space-y-10">
          <div>
            <h2 className="font-heading text-2xl">Address</h2>
            <p className="mt-2 opacity-80">{siteConfig.address}</p>
          </div>

          <div>
            <h2 className="font-heading text-2xl">Opening hours</h2>
            <ul className="mt-2 max-w-xs">
              {siteConfig.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between border-b border-accent/20 py-2 text-sm"
                >
                  <span>{h.day}</span>
                  <span className="opacity-80">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-2xl">Get in touch</h2>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <a href={phoneLink} className="hover:text-accent">
                  Call: {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          {siteConfig.mapEmbedUrl ? (
            <iframe
              src={siteConfig.mapEmbedUrl}
              className="h-80 w-full rounded-2xl border-0"
              loading="lazy"
              title="Salon location map"
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-accent/40 bg-white/60 text-sm opacity-70">
              Map coming soon
            </div>
          )}
        </div>
      </div>
    </main>
  );
}