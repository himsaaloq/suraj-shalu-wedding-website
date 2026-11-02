import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://suraj-shalu-wedding-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Suraj ♥ Shalu | शुभ विवाह निमंत्रण",
  description:
    "आयुष्मान सूरज एवं आयुष्मती शालू के शुभ विवाह में सपरिवार सादर आमंत्रित। 11 दिसंबर 2026 | भीलवाड़ा एवं चित्तौड़गढ़, राजस्थान।",
  applicationName: "Suraj & Shalu Wedding Invitation",
  openGraph: {
    title: "Suraj ♥ Shalu | शुभ विवाह",
    description: "11 दिसंबर 2026 — आपके स्नेहाशीष के आकांक्षी।",
    type: "website",
    url: "/",
    locale: "hi_IN",
    siteName: "Suraj & Shalu Wedding Invitation",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Suraj & Shalu — शुभ विवाह निमंत्रण" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suraj ♥ Shalu | शुभ विवाह",
    description: "11 दिसंबर 2026 — आपके स्नेहाशीष के आकांक्षी।",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#591b2b",
  width: "device-width",
  initialScale: 1,
};

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&display=swap";

// Runs before first paint: enables reveal-on-scroll and shows the opening screen (no flash of the page behind it).
const JS_FLAG = "document.documentElement.classList.add('js','intro')";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <noscript>
          <style>{`.js [data-reveal],.js [data-stagger]>*{opacity:1!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
