export default function Footer() {
  return (
    <footer className="mt-20 border-t border-accent/30 py-8 text-center text-sm opacity-70">
      © {new Date().getFullYear()} My Salon. All rights reserved.
    </footer>
  );
}