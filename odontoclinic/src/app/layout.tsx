import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ChatWidget } from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Odontoclinic — Clínica Odontológica",
  description: "Sistema de citas y reservas — Odontoclinic Clínica Odontológica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Header />
        <main>{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
