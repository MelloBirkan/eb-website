'use client'

import { SpecularButton } from '../../components/_eb/specular-button'
import { Icon } from './tutorial-primitives'

export function ScrollToAgentsButton() {
  const onClick = () => {
    document.getElementById('escolha-seu-agente')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <SpecularButton onClick={onClick}>
      Começar agora <Icon name="arrow" size={13} />
    </SpecularButton>
  )
}
