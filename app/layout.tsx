import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Daijun — Research & Notes",
      template: "%s — Daijun",
    },
    description: "Research projects, working notes, and essays by Daijun.",
    openGraph: {
      type: "website",
      title: "Daijun — Research & Notes",
      description: "Research projects, working notes, and essays by Daijun.",
      images: [{ url: new URL("/og-v2.png", metadataBase).toString(), width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Daijun — Research & Notes",
      description: "Research projects, working notes, and essays by Daijun.",
      images: [new URL("/og-v2.png", metadataBase).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
