// Facts from the JIIHC 2026 paper (EvenBetter-JIIHC/main.tex). Every number on the
// research page comes from here, so it stays traceable to the paper.

export const PAPER = {
  title: 'Curated Agent Skills for Context-Aware Intelligent Support in iOS UX and Accessibility',
  titlePt: 'Skills curadas para apoio inteligente e sensível ao contexto em UX e acessibilidade no iOS',
  venue: "8WoSI² · 12JIHC'26",
  venueLong:
    "8° Workshop en Sistemas Interactivos Inteligentes (8WoSI²), 12° Jornadas Iberoamericanas de Interacción Humano-Computadora (12JIHC'26)",
  place: 'Talca, Chile',
  talk: 'Universidad de Talca, 10 de novembro de 2026',
  code: 'https://github.com/MelloBirkan/EvenBetterFramework',
  slides: 'https://evenbetter-slides.mellofattura.com/jiihc',
  program: 'https://jihci2026.utalca.cl/programa.html',
}

export const AUTHORS = [
  { name: 'Marcello Gonzatto Birkan', inst: 1, orcid: '0009-0003-7061-5238' },
  { name: 'Daniela Brazolin Flauto', inst: 1, orcid: '0009-0007-3936-664X' },
  { name: 'Valéria Farinazzo Martins', inst: 2, orcid: '0000-0002-5058-6017' },
]

export const INSTITUTIONS = [
  'Faculdade de Computação e Informática, Universidade Presbiteriana Mackenzie, São Paulo',
  'Programa de Pós-Graduação em Computação Aplicada, Faculdade de Computação e Informática, Universidade Presbiteriana Mackenzie, São Paulo',
]

export const BIBTEX = `@inproceedings{birkan2026evenbetter,
  title     = {Curated Agent Skills for Context-Aware Intelligent Support in iOS UX and Accessibility},
  author    = {Gonzatto Birkan, Marcello and Brazolin Flauto, Daniela and Farinazzo Martins, Val{\\'e}ria},
  booktitle = {8{\\textdegree} Workshop en Sistemas Interactivos Inteligentes (8WoSI{\\textsuperscript{2}}), 12{\\textdegree} Jornadas Iberoamericanas de Interacci{\\'o}n Humano-Computadora (12JIHC'26)},
  address   = {Talca, Chile},
  year      = {2026},
  note      = {Accepted paper}
}`

export const CITATION_TEXT =
  "Gonzatto Birkan, M., Brazolin Flauto, D., Farinazzo Martins, V.: Curated Agent Skills for Context-Aware Intelligent Support in iOS UX and Accessibility. In: 8° Workshop en Sistemas Interactivos Inteligentes (8WoSI²), 12° Jornadas Iberoamericanas de Interacción Humano-Computadora (12JIHC'26). Talca, Chile (2026). Artigo aceito."

export type Reference = { n: number; text: string; url?: string }

/** The 25 references of the paper, in its order and LNCS format. */
export const REFERENCES: Reference[] = [
  { n: 1, text: 'World Wide Web Consortium (W3C): Web Content Accessibility Guidelines (WCAG) 2.2. W3C Web Accessibility Initiative (2024)', url: 'https://www.w3.org/TR/WCAG22/' },
  { n: 2, text: 'Apple: Human Interface Guidelines. Apple Developer, last accessed 2026/08/28', url: 'https://developer.apple.com/design/human-interface-guidelines/' },
  { n: 3, text: 'Apple: Accessibility. Apple Developer, last accessed 2026/08/28', url: 'https://developer.apple.com/accessibility/' },
  { n: 4, text: 'WebAIM: The WebAIM Million: The 2026 Report on the Accessibility of the Top 1,000,000 Home Pages. WebAIM (2026)', url: 'https://webaim.org/projects/million/' },
  { n: 5, text: 'Stack Overflow: Stack Overflow Developer Survey 2025. Stack Overflow (2025)', url: 'https://survey.stackoverflow.co/2025/ai' },
  { n: 6, text: 'Anthropic: Equipping agents for the real world with Agent Skills. Anthropic Engineering (2025)', url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills' },
  { n: 7, text: 'Agent Skills: Agent Skills Specification (2025)', url: 'https://agentskills.io/specification' },
  { n: 8, text: 'Nielsen, J.: The Articulation Barrier: Prompt-Driven AI UX Hurts Usability. UX Tigers (2023)', url: 'https://www.uxtigers.com/post/ai-articulation-barrier' },
  { n: 9, text: 'Zhong, M., Chen, R., Chen, X., Fogarty, J., Wobbrock, J.O.: ScreenAudit: Detecting Screen Reader Accessibility Errors in Mobile Apps Using Large Language Models. In: Proceedings of CHI 2025. ACM (2025)' },
  { n: 10, text: 'Fathallah, N., Hernandez, D., Staab, S.: AccessGuru: Leveraging LLMs to Detect and Correct Web Accessibility Violations in HTML Code. In: Proceedings of the 27th International ACM SIGACCESS Conference on Computers and Accessibility. ACM (2025)' },
  { n: 11, text: 'Mehralian, F., Barik, T., Nichols, J., Swearngin, A.: Automated Code Fix Suggestions for Accessibility Issues in Mobile Apps. arXiv preprint arXiv:2408.03827 (2024)', url: 'https://arxiv.org/abs/2408.03827' },
  { n: 12, text: 'Yuan, M., Chen, J., Xing, Z., Quigley, A., Luo, Y., Luo, T., Mohammadi, G., Lu, Q., Zhu, L.: DesignRepair: Dual-Stream Design Guideline-Aware Frontend Repair with Large Language Models. arXiv preprint arXiv:2411.01606 (2024)', url: 'https://arxiv.org/abs/2411.01606' },
  { n: 13, text: 'Lewis, P., et al.: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. In: NeurIPS 2020. Curran Associates (2020)' },
  { n: 14, text: 'Liu, N.F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., Liang, P.: Lost in the Middle: How Language Models Use Long Contexts. Transactions of the Association for Computational Linguistics 12, 157–173 (2024)' },
  { n: 15, text: 'Li, X., et al.: SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks. arXiv preprint arXiv:2602.12670 (2026)', url: 'https://arxiv.org/abs/2602.12670' },
  { n: 16, text: 'Hevner, A.R., March, S.T., Park, J., Ram, S.: Design Science in Information Systems Research. MIS Quarterly 28(1), 75–106 (2004)' },
  { n: 17, text: 'Peffers, K., Tuunanen, T., Rothenberger, M.A., Chatterjee, S.: A Design Science Research Methodology for Information Systems Research. Journal of Management Information Systems 24(3), 45–77 (2007)' },
  { n: 18, text: 'van Someren, M.W., Barnard, Y.F., Sandberg, J.A.C.: The Think Aloud Method: A Practical Guide to Modelling Cognitive Processes. Academic Press, London (1994)' },
  { n: 19, text: 'Brooke, J.: SUS: A Quick and Dirty Usability Scale. In: Jordan, P.W., Thomas, B., Weerdmeester, B.A., McClelland, I.L. (eds.) Usability Evaluation in Industry, pp. 189–194. Taylor & Francis, London (1996)' },
  { n: 20, text: 'Bangor, A., Kortum, P.T., Miller, J.T.: An Empirical Evaluation of the System Usability Scale. International Journal of Human-Computer Interaction 24(6), 574–594 (2008)' },
  { n: 21, text: 'Bangor, A., Kortum, P., Miller, J.: Determining What Individual SUS Scores Mean: Adding an Adjective Rating Scale. Journal of Usability Studies 4(3), 114–123 (2009)' },
  { n: 22, text: 'Braun, V., Clarke, V.: Using Thematic Analysis in Psychology. Qualitative Research in Psychology 3(2), 77–101 (2006)' },
  { n: 23, text: 'Shneiderman, B.: Human-Centered Artificial Intelligence: Reliable, Safe & Trustworthy. International Journal of Human-Computer Interaction 36(6), 495–504 (2020)' },
  { n: 24, text: 'Parasuraman, R., Manzey, D.H.: Complacency and Bias in Human Use of Automation: An Attentional Integration. Human Factors 52(3), 381–410 (2010)' },
  { n: 25, text: 'High-Level Expert Group on Artificial Intelligence: Ethics Guidelines for Trustworthy AI. European Commission, Brussels (2019)' },
]

/** Sections of the research page, in order. Ids are linked from the nav, footer and ⌘K. */
export const SECTIONS = [
  { id: 'contexto', label: 'Contexto' },
  { id: 'comando', label: 'Humano no comando' },
  { id: 'requisitos', label: 'Requisitos' },
  { id: 'framework', label: 'Arquitetura' },
  { id: 'clausulas', label: 'Cláusulas' },
  { id: 'relatorio', label: 'Relatório' },
  { id: 'metodo', label: 'Método' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'implicacoes', label: 'Implicações' },
  { id: 'limites', label: 'Limites' },
  { id: 'etica', label: 'Ética e código' },
  { id: 'citar', label: 'Como citar' },
  { id: 'referencias', label: 'Referências' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** "01", "02"… for a section's eyebrow. */
export function sectionNumber(id: SectionId) {
  return String(SECTIONS.findIndex((s) => s.id === id) + 1).padStart(2, '0')
}
