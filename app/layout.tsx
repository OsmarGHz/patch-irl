import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PATCH IRL — Small fixes. Real life.",
  description: "Turn everyday friction into a practical, visual reality patch with Meta AI.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
