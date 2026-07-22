import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daijun-research-notes.jundai332.chatgpt.site";
const metadataBase = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);
const socialImageUrl = new URL("og-v3.png", metadataBase).toString();

export const metadata: Metadata = {
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
    images: [{ url: socialImageUrl, width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daijun — Research & Notes",
    description: "Research projects, working notes, and essays by Daijun.",
    images: [socialImageUrl],
  },
};

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
