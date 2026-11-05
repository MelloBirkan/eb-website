import { Hero } from '../components/site/hero'
import { StandardsTicker } from '../components/site/standards-ticker'
import { SectionHeader } from '../components/site/section-header'
import { ProblemStats } from '../components/site/problem'
import { Workflow } from '../components/site/workflow'
import { CorpusExplorer } from '../components/site/corpus-explorer'
import { StudyHighlight } from '../components/site/study'
import { SkillsExplorer } from '../components/site/skills-explorer'
import { Install } from '../components/site/install'
import { PaperCta } from '../components/site/paper-cta'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <StandardsTicker />

      <section id="problema" aria-labelledby="problema-title" className="wrap py-20 md:py-32">
        <SectionHeader
          id="problema-title"
          eyebrow="O problema"
          title={
            <>
              Código que compila ainda pode excluir <span className="serif">gente</span>.
            </>
          }
          lede="Falhas de acessibilidade estão em quase todo lugar, e os verificadores automáticos pegam só uma parte delas. Agora que a IA escreve boa parte das telas, ela precisa conhecer as regras."
        />
        <ProblemStats />
      </section>

      <section id="como-funciona" aria-labelledby="fluxo-title" className="border-y border-line bg-paper-2/60 py-20 md:py-32">
        <div className="wrap">
          <SectionHeader
            id="fluxo-title"
            eyebrow="Como funciona"
            title={
              <>
                Quatro etapas. Você no <span className="serif">comando</span> de todas.
              </>
            }
            lede="Cada etapa é uma skill que você chama quando quiser. O agente faz o trabalho pesado e para nas decisões que são suas."
          />
          <Workflow />
        </div>
      </section>

      <section id="corpus" aria-labelledby="corpus-title" className="wrap py-20 md:py-32">
        <SectionHeader
          id="corpus-title"
          eyebrow="O corpus"
          title={
            <>
              49 cláusulas, cada uma com <span className="serif">fonte</span>.
            </>
          }
          lede="O agente não audita de memória. Ele consulta um corpus montado a partir do HIG, da documentação de acessibilidade da Apple e da WCAG 2.2. Escolha uma cláusula para ver de onde ela vem."
        />
        <CorpusExplorer />
      </section>

      <section id="estudo" aria-labelledby="estudo-title" className="border-y border-line bg-paper-2/60 py-20 md:py-32">
        <div className="wrap">
          <SectionHeader
            id="estudo-title"
            eyebrow="O estudo"
            title={
              <>
                Dez devs iOS testaram. A usabilidade ficou em <span className="serif">79,5</span>.
              </>
            }
            lede="Cada sessão durou cerca de 30 minutos: explorar o site, planejar um app, auditar um projeto e responder ao SUS, um questionário padrão de usabilidade que vai de 0 a 100."
          />
          <StudyHighlight />
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-title" className="wrap py-20 md:py-32">
        <SectionHeader
          id="skills-title"
          eyebrow="As skills"
          title={
            <>
              16 skills para o ciclo <span className="serif">inteiro</span> do app.
            </>
          }
          lede="Do planejamento ao simulador. Instale uma vez e chame cada skill pelo nome quando precisar."
        />
        <SkillsExplorer />
      </section>

      <section id="comecar" aria-labelledby="comecar-title" className="on-night night-glow py-20 md:py-32">
        <div className="wrap">
          <SectionHeader
            id="comecar-title"
            eyebrow="Comece agora"
            align="center"
            night
            title={
              <>
                Instale em <span className="serif">um minuto</span>.
              </>
            }
            lede="Funciona no Claude Code e no Codex. O código é aberto."
          />
          <Install />
        </div>
      </section>

      <PaperCta />
    </main>
  )
}
