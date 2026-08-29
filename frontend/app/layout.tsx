import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Healthcare Access Gap Mapper",
  description:
    "Rural and remote healthcare accessibility intelligence dashboard for Oman and Saudi Arabia.",
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