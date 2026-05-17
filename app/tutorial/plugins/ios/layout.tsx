import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plugin EvenBetter iOS, como usar as 15 skills + Xcode MCP',
  description:
    'Guia passo a passo das 15 skills do plugin EvenBetter iOS: planejamento de UX, design, padrões SwiftUI, auditoria HIG/WCAG, performance, haptics, Xcode MCP (xcrun mcpbridge) e integração com sistema. Exemplos para Claude Code e Codex.',
}

export default function TutorialPluginsIosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
