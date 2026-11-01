import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suraj ♥ Shalu | शुभ विवाह निमंत्रण",
  description:
    "आयुष्मान सूरज एवं आयुष्मती शालू के शुभ विवाह में सपरिवार सादर आमंत्रित। 11 दिसंबर 2026 | भीलवाड़ा एवं चित्तौड़गढ़, राजस्थान।",
  applicationName: "Suraj & Shalu Wedding Invitation",
  openGraph: {
    title: "Suraj ♥ Shalu | शुभ विवाह",
    description: "11 दिसंबर 2026 — आपके स्नेहाशीष के आकांक्षी।",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#591b2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}