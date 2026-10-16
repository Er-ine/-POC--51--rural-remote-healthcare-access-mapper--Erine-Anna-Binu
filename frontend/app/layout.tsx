import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Infocreon Internship — Rural & Remote Healthcare Access Gap Mapper",
  description:
    "Cinematic geospatial intelligence interface analyzing rural and remote healthcare access disparities, travel horizons, and catchment models for POC-51.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full w-full bg-[#06161a]">
      <body className="h-full w-full overflow-hidden bg-[#06161a] text-[#f0fdfa] antialiased">
        {children}
      </body>
    </html>
  );
}