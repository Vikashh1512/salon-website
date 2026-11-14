import Link from "next/link";

export default function Button({ href, variant = "solid", children }) {
  const base =
    "inline-flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition";
  const styles =
    variant === "outline"
      ? "border border-ink/40 text-ink hover:border-accent hover:text-accent"
      : "bg-accent text-ink hover:opacity-90";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      <span>{children}</span>
      <span aria-hidden="true">{variant === "outline" ? "→" : "↗"}</span>
    </Link>
  );
}