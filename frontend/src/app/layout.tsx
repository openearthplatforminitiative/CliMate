import type { Metadata } from "next";
import { Comic_Neue, Inter } from "next/font/google";
import "./globals.css";
import { CoordinatesProvider } from "@/lib/CoordinatesContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoReport",
  description: "TODO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <CoordinatesProvider>{children}</CoordinatesProvider>
      </body>
    </html>
  );
}
