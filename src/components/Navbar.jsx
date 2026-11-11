import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-accent/30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-2xl">
          My Salon
        </Link>

        <ul className="hidden gap-8 text-sm md:flex">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><Link href="/services" className="hover:text-accent">Services</Link></li>
          <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
        </ul>

        <Link
          href="/book"
          className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition hover:opacity-90"
        >
          Book now
        </Link>
      </nav>
    </header>
  );
}