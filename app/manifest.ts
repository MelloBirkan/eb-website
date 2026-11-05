import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EvenBetter",
    short_name: "EvenBetter",
    description:
      "Skills curadas para o seu agente de IA planejar, auditar e corrigir apps SwiftUI. Você continua no comando.",
    lang: "pt-BR",
    start_url: "/",
    display: "browser",
    background_color: "#f6f7f3",
    theme_color: "#0b1a18",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
