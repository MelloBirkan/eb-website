import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./evenbetter.css";
import "./site.css";
import { MotionProvider } from "../components/site/motion-provider";
import { SiteNav } from "./_components/site-nav";
import { SiteFooter } from "./_components/site-footer";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://evenbetter.mellofattura.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EvenBetter · Skills curadas para acessibilidade em iOS",
    template: "%s · EvenBetter",
  },
  description:
    "Skills curadas que ensinam o seu agente de IA a planejar, auditar e corrigir apps SwiftUI com o HIG da Apple e a WCAG 2.2. Funciona no Claude Code e no Codex. Artigo aceito na JIIHC 2026.",
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
    "JIIHC 2026",
    "human-in-command",
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
    title: "EvenBetter · Skills curadas para acessibilidade em iOS",
    description:
      "Skills curadas para o seu agente de IA planejar, auditar e corrigir apps SwiftUI. Você continua no comando.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "EvenBetter",
    description:
      "Skills curadas para o seu agente de IA planejar, auditar e corrigir apps SwiftUI. Você continua no comando.",
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
        <MotionProvider>
          {/* The header and footer live here, outside the pages, so they stay mounted between pages:
              the bar does not replay its entrance and the tab pill slides to the new page. */}
          <div className="site">
            <SiteNav />
            {children}
            <SiteFooter />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1513" },
  ],
};
