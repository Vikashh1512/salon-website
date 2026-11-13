import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: " The Biggest Salon",
  description: "Book your hair appointment online. Haircuts, colour, spa and more.",
  manifest: "/manifest.webmanifest",
  icons: { apple: "/icon-192.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}