import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sort 17Lands",
  description: "Order MTGA cards by Ever Drawn Win Rate (17Lands)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
