'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { CommandPalette } from '../../components/_eb/command-palette'
import { BrandMark, Close, GitHub, Menu, Search } from '../../components/site/icons'
import { SPRING } from '../../components/site/motion'

type NavLink = { href: string; label: string; match: (path: string) => boolean }

const LINKS: NavLink[] = [
  { href: '/', label: 'Início', match: (p) => p === '/' },
  { href: '/pesquisa', label: 'Pesquisa', match: (p) => p.startsWith('/pesquisa') },
  { href: '/tutorial/plugins/ios', label: 'Guias', match: (p) => p.startsWith('/tutorial') },
  { href: '/about', label: 'Sobre', match: (p) => p.startsWith('/about') },
]

const GITHUB = 'https://github.com/MelloBirkan/EvenBetterFramework'

export function SiteNav() {
  const pathname = usePathname() ?? '/'
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Phones only (see site.css): the bar slides away while you read down and comes back as soon as you scroll up.
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 12)
    const dy = y - lastY.current
    // Small moves add up until they pass the threshold, so a slow scroll still counts.
    if (Math.abs(dy) < 10) return
    lastY.current = y
    const focusInside = headerRef.current?.contains(document.activeElement) ?? false
    setHidden(dy > 0 && y > 160 && !focusInside)
  })

  // The open menu holds the page still and keeps the bar in place.
  useEffect(() => {
    if (!menuOpen) return
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = before
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  /** Clicking the brand or Início on the home page scrolls back to the top. */
  function toTop(e: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== '/') return
    e.preventDefault()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' })
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="scrim"
            aria-hidden
            className="sn-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <header
        ref={headerRef}
        className="sn-wrap"
        data-scrolled={scrolled || menuOpen ? 'true' : 'false'}
        data-hidden={hidden && !menuOpen && !paletteOpen ? 'true' : 'false'}
        onFocus={() => setHidden(false)}
      >
        {/* The entrance is CSS (.sn-enter), so the bar shows with the first paint instead of after hydration. */}
        <nav aria-label="Principal" className="sn-bar sn-enter">
          <Link href="/" className="sn-brand" onClick={toTop} aria-label="EvenBetter, início">
            <BrandMark size={30} className="sn-mark" />
            <span className="sn-word">
              Even<span className="sn-word-em">Better</span>
            </span>
          </Link>

          <LayoutGroup id="site-nav">
            <ul className="sn-links" role="list">
              {LINKS.map((l) => {
                const active = l.match(pathname)
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={l.href === '/' ? toTop : undefined}
                      className="sn-link"
                      data-active={active ? 'true' : 'false'}
                      aria-current={active ? 'page' : undefined}
                    >
                      {active && (
                        <motion.span layoutId="sn-pill" className="sn-pill" transition={SPRING.ui} aria-hidden />
                      )}
                      <span className="relative">{l.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </LayoutGroup>

          <div className="sn-actions">
            <button type="button" className="sn-search" onClick={() => setPaletteOpen(true)} aria-label="Buscar no site (⌘K)">
              <Search size={15} />
              <span className="sn-search-label">Buscar</span>
              <kbd className="sn-kbd">⌘K</kbd>
            </button>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="sn-icon" aria-label="EvenBetter no GitHub">
              <GitHub size={17} />
            </a>
            <Link href="/#comecar" className="sn-cta">
              Instalar
            </Link>
            <button
              type="button"
              className="sn-icon sn-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="sn-mobile"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={menuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  className="grid place-items-center"
                >
                  {menuOpen ? <Close size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="sn-mobile"
              className="sn-sheet"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={SPRING.ui}
            >
              <motion.ul
                role="list"
                initial="hidden"
                animate="shown"
                variants={{ shown: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
              >
                {LINKS.map((l) => (
                  <motion.li
                    key={l.href}
                    variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }}
                    transition={SPRING.ui}
                  >
                    <Link
                      href={l.href}
                      className="sn-sheet-link"
                      aria-current={l.match(pathname) ? 'page' : undefined}
                      onClick={(e) => {
                        if (l.href === '/') toTop(e)
                        setMenuOpen(false)
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="sn-sheet-actions">
                <Link href="/#comecar" className="sn-cta sn-cta-wide" onClick={() => setMenuOpen(false)}>
                  Instalar o plugin
                </Link>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="sn-sheet-gh">
                  <GitHub size={16} /> GitHub
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
