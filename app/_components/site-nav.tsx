'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type MouseEvent } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { Logo } from './tutorial-primitives'
import { CommandPalette } from '../../components/_eb/command-palette'

type NavLink = { href: string; label: string }
const LINKS: NavLink[] = [
  { href: '/', label: 'Início' },
  { href: '/#escolha-seu-agente', label: 'Guias' },
  { href: '/about', label: 'Sobre' },
]

/** Sections on the home page that map to nav links. */
const HOME_GUIDE_SECTIONS = ['escolha-seu-agente', 'skills']

/**
 * Scroll-spy: returns true if any of the given section ids has its top edge
 * above the line `viewport - rootMarginBottom`. Top-of-page returns false.
 */
function useScrollSpy(ids: string[], enabled: boolean) {
  const [hit, setHit] = useState(false)

  useEffect(() => {
    if (!enabled || ids.length === 0) {
      // Reset state when scroll-spy disabled (e.g. leaving the home page).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHit(false)
      return
    }

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const evaluate = () => {
      // "Hit" when at least one tracked section's top has crossed the
      // line at 1/3 of the viewport from the top — feels right for sticky nav.
      const trigger = window.innerHeight * 0.33
      const anyAbove = els.some((el) => el.getBoundingClientRect().top <= trigger)
      setHit(anyAbove)
    }

    evaluate()
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        evaluate()
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids, enabled])

  return hit
}

export function SiteNav() {
  const pathname = usePathname()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const isHome = pathname === '/'
  const inGuidesSection = useScrollSpy(HOME_GUIDE_SECTIONS, isHome)

  function isActive(href: string) {
    if (!pathname) return false
    if (isHome) {
      // Scroll-spy on the home page: top → Início, anchored sections → Guias.
      if (href === '/') return !inGuidesSection
      if (href.startsWith('/#')) return inGuidesSection
      return false
    }
    if (href === '/') return false
    if (href === '/about') return pathname === '/about'
    // "Guias" is the /tutorial/* anchor — active inside any tutorial page.
    if (href.startsWith('/#')) return pathname.startsWith('/tutorial')
    return pathname.startsWith(href)
  }

  /** Clicking Início while already on / should scroll to top + drop the hash. */
  function handleInicioClick(e: MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      e.preventDefault()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      // Drop any leftover hash so back/forward + share urls feel right.
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
  }

  /** Clicking Guias while already on / should smooth-scroll to the section. */
  function handleGuiasClick(e: MouseEvent<HTMLAnchorElement>) {
    if (isHome) {
      e.preventDefault()
      const target = document.getElementById('escolha-seu-agente')
      if (target) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        window.history.replaceState(null, '', '/#escolha-seu-agente')
      }
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="eb-nav-wrap">
        <LayoutGroup id="nav-tabs">
          <nav className="eb-nav" aria-label="Principal">
            <Link href="/" className="eb-brand" onClick={handleInicioClick}>
              <span className="eb-brand-mark"><Logo /></span>
              EVENBETTER
            </Link>
            <div className="eb-nav-links">
              {LINKS.map((l) => {
                const active = isActive(l.href)
                const isInicio = l.href === '/'
                const isGuias = l.href.startsWith('/#')
                const onClick = isInicio ? handleInicioClick : isGuias ? handleGuiasClick : undefined
                // Custom handlers manage scroll for same-page links; let Next handle real route changes.
                const skipNextScroll = isInicio || isGuias
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClick}
                    scroll={!skipNextScroll}
                    className={`eb-nav-link ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    style={{ position: 'relative' }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="eb-nav-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        aria-hidden
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1 }}>{l.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="eb-nav-spacer" />
            <button
              type="button"
              className="eb-search-trigger"
              onClick={() => setPaletteOpen(true)}
              aria-label="Abrir busca (Cmd+K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Buscar</span>
              <span className="eb-kbd">⌘K</span>
            </button>
          </nav>
        </LayoutGroup>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
