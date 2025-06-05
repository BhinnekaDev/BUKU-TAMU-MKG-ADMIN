import "@/app/globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buku Tamu Admin ",
  description: "Buku Tamu Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
