import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./evenbetter.css";

const geist = Geist({
  weight: "variable",
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  weight: "variable",
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evenbetter.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EvenBetter — Skills curadas para acessibilidade em iOS",
    template: "%s · EvenBetter",
  },
  description:
    "Framework de skills curadas para Codex, Claude Code e o plugin EvenBetter iOS. Acessibilidade e UX desde o dia zero do desenvolvimento mobile.",
  keywords: [
    "EvenBetter",
    "iOS",
    "SwiftUI",
    "acessibilidade",
    "Claude Code",
    "Codex",
    "agent skills",
    "Mackenzie",
    "TCC",
    "WCAG",
    "HIG",
  ],
  authors: [
    { name: "Marcello Birkan" },
    { name: "Daniela Flauto" },
    { name: "Valéria Farinazzo Martins" },
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "EvenBetter",
    title: "EvenBetter — Skills curadas para acessibilidade em iOS",
    description:
      "Framework de skills curadas para Codex, Claude Code e o plugin EvenBetter iOS.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "EvenBetter",
    description:
      "Framework de skills curadas para Codex, Claude Code e o plugin EvenBetter iOS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="eb-skip-link">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
