import type { StaticImageData } from 'next/image'
import valeriaPhoto from '../../../public/team/valeria-farinazzo.png'
import marcelloPhoto from '../../../public/team/marcello-birkan.png'
import danielaPhoto from '../../../public/team/daniela-flauto.png'

export type Member = {
  name: string
  short: string
  role: string
  bio: string
  email: string
  orcid: string
  photo: StaticImageData
  /** object-position that keeps the face in a portrait crop */
  focus: string
}

/** Same order as the paper's author list. */
export const TEAM: Member[] = [
  {
    name: 'Marcello Gonzatto Birkan',
    short: 'Marcello',
    role: 'Autor',
    bio: 'Estudante da FCI/Mackenzie, com foco em iOS e SwiftUI. Cuida da implementação das skills e do plugin para iOS.',
    email: 'marcello.birkan@mackenzista.com.br',
    orcid: '0009-0003-7061-5238',
    photo: marcelloPhoto,
    focus: '50% 28%',
  },
  {
    name: 'Daniela Brazolin Flauto',
    short: 'Daniela',
    role: 'Autora',
    bio: 'Estudante da FCI/Mackenzie, com foco em UX e acessibilidade. Cuida da curadoria do corpus de cláusulas.',
    email: 'daniela.flauto@mackenzista.com.br',
    orcid: '0009-0007-3936-664X',
    photo: danielaPhoto,
    focus: '52% 40%',
  },
  {
    name: 'Valéria Farinazzo Martins',
    short: 'Valéria',
    role: 'Orientadora',
    bio: 'Professora da FCI e do Programa de Pós-Graduação em Computação Aplicada do Mackenzie. Pesquisa interação humano-computador, acessibilidade e UX.',
    email: 'valeria.farinazzo@mackenzie.br',
    orcid: '0000-0002-5058-6017',
    photo: valeriaPhoto,
    focus: '45% 30%',
  },
]
