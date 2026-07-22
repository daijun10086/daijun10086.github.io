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
      images: [{ url: new URL("/og-v3.png", metadataBase).toString(), width: 1536, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Daijun — Research & Notes",
      description: "Research projects, working notes, and essays by Daijun.",
      images: [new URL("/og-v3.png", metadataBase).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme-mode')||'auto';if(['light','auto','dark'].indexOf(m)<0)m='auto';var h=new Date().getHours();var t=m==='auto'?(h>=18||h<6?'dark':'light'):m;document.documentElement.dataset.themeMode=m;document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
