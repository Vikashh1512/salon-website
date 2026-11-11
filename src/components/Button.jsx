import Link from "next/link";

export default function Button({ href, children, variant = "solid" }) {
  const styles =
    variant === "solid"
      ? "bg-ink text-paper hover:opacity-90"
      : "border border-ink text-ink hover:bg-ink hover:text-paper";

  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-6 py-3 text-sm transition ${styles}`}
    >
      {children}
    </Link>
  );
}