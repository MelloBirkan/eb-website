import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plugin EvenBetter iOS, como usar as 12 skills',
  description:
    'Guia passo a passo das 12 skills do plugin EvenBetter iOS: planejamento de UX, padrões SwiftUI, auditoria HIG/WCAG, performance, acessibilidade e integração com sistema. Exemplos para Claude Code e Codex.',
}

export default function TutorialPluginsIosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
