import { Oswald, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oswald",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
});

export const metadata = {
  title: "The Biggest Salon",
  description: "Book your hair appointment online. Haircuts, colour, spa and more.",
  manifest: "/manifest.webmanifest",
  icons: { apple: "/icon-192.png" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="font-body antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}