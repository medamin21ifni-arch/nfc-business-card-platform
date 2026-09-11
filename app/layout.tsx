import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFC Business Cards",
  description: "Plateforme privée pour créer des cartes digitales NFC personnalisées.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
