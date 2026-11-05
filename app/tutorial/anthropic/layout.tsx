import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instalar o EvenBetter no Claude Code',
  description: 'Aprenda a instalar e usar a skill de acessibilidade do EvenBetter no Claude Code em 3 passos.',
}

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
