import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-accent/30 py-8 text-center text-sm">
      <p className="opacity-70">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
      <a
        href={siteConfig.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block hover:text-accent"
      >
        Instagram
      </a>
    </footer>
  );
}