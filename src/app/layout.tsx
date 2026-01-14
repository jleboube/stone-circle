import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoHypothesis Explorer | Discover Earth's Ancient Power",
  description:
    "Explore the hypothesis that ancient stone circles were electromagnetic energy harvesters. Find optimal test sites near you based on geological and geophysical data.",
  keywords: [
    "stone circles",
    "ancient mysteries",
    "electromagnetic energy",
    "geophysics",
    "Stonehenge",
    "telluric currents",
    "Earth energy",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
      </body>
    </html>
  );
}
