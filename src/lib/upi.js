import { siteConfig } from "@/lib/siteConfig";

// Builds a standard UPI payment link: upi://pay?pa=...&pn=...&am=...
export function buildUpiLink(amount, note) {
  const parts = [
    `pa=${siteConfig.upiId}`,
    `pn=${encodeURIComponent(siteConfig.upiName)}`,
    `am=${Number(amount).toFixed(2)}`,
    "cu=INR",
    `tn=${encodeURIComponent(note)}`,
  ];
  return `upi://pay?${parts.join("&")}`;
}