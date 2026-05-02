import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instalar plugin EvenBetter no Codex — EvenBetter',
  description: 'Aprenda a instalar e usar o plugin de acessibilidade do EvenBetter no Codex em 3 passos.',
}

export default function TutorialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
