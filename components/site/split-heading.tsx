'use client'

import { animate, useInView } from 'motion/react'
import { splitText } from 'motion-plus'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { EASE_OUT } from './motion'

type Split = { words: HTMLElement[]; lineIndex: number[]; revert: () => void }

/**
 * Splits every text node of `root` into words with Motion+ `splitText`, so
 * inline markup (the serif italics) stays where it is, then groups the words
 * into the lines they sit on.
 */
function splitWords(root: HTMLElement): Split {
  const label = root.getAttribute('aria-label')
  const text = (root.textContent ?? '').replace(/\s+/g, ' ').trim()
  const restores: Array<() => void> = []
  const words: HTMLElement[] = []

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    if (node.data.trim()) nodes.push(node)
  }

  for (const node of nodes) {
    // Spaces at the edges stay plain text outside the split. Inside it they
    // become an empty word box, which can start a line and indent it.
    const [, lead, core, trail] = node.data.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? ['', '', node.data, '']
    const holder = document.createElement('span')
    holder.textContent = core
    const parts: Node[] = [holder]
    if (lead) parts.unshift(document.createTextNode(lead))
    if (trail) parts.push(document.createTextNode(trail))
    node.replaceWith(...parts)
    restores.push(() => {
      parts[0].parentNode?.replaceChild(node, parts[0])
      for (const part of parts.slice(1)) part.parentNode?.removeChild(part)
    })
    const split = splitText(holder, { wordClass: 'split-word' })
    holder.removeAttribute('aria-label')
    holder.setAttribute('aria-hidden', 'true')
    // Lines are measured below across the whole heading.
    for (const line of split.lines) line.replaceWith(...Array.from(line.childNodes))
    for (const word of split.words) {
      word.replaceChildren(word.textContent ?? '')
      word.style.verticalAlign = ''
      if (word.textContent) words.push(word)
    }
  }

  root.setAttribute('aria-label', text)

  const lineIndex: number[] = []
  let line = -1
  let lineBottom = Number.NEGATIVE_INFINITY
  for (const word of words) {
    const { top, bottom } = word.getBoundingClientRect()
    if (top >= lineBottom - 1) {
      line += 1
      lineBottom = bottom
    } else {
      lineBottom = Math.max(lineBottom, bottom)
    }
    lineIndex.push(line)
  }

  return {
    words,
    lineIndex,
    revert: () => {
      for (const restore of restores.splice(0).reverse()) restore()
      if (label === null) root.removeAttribute('aria-label')
      else root.setAttribute('aria-label', label)
    },
  }
}

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  children: ReactNode
  /** Seconds before the first line starts. */
  delay?: number
  /** Play on mount instead of when the heading scrolls into view. */
  immediate?: boolean
}

/**
 * Editorial headline: words rise line by line out of a soft blur.
 * The heading is server-rendered as plain text and only split in the browser.
 */
export function SplitHeading({ as = 'h2', id, className, children, delay = 0, immediate = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const [split, setSplit] = useState<Split | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let current: Split | null = null
    document.fonts.ready.then(() => {
      if (cancelled) return
      current = splitWords(el)
      for (const word of current.words) word.style.opacity = '0'
      el.dataset.split = 'ready'
      setSplit(current)
    })
    return () => {
      cancelled = true
      current?.revert()
      el.dataset.split = 'pending'
    }
  }, [])

  useEffect(() => {
    if (!split || !(immediate || inView)) return
    const firstOfLine = new Map<number, number>()
    split.lineIndex.forEach((line, i) => {
      if (!firstOfLine.has(line)) firstOfLine.set(line, i)
    })
    const controls = animate(
      split.words,
      { opacity: [0, 1], y: ['0.42em', '0em'], filter: ['blur(8px)', 'blur(0px)'] },
      {
        duration: 0.95,
        ease: EASE_OUT,
        delay: (i: number) => {
          const line = split.lineIndex[i] ?? 0
          return delay + line * 0.12 + (i - (firstOfLine.get(line) ?? i)) * 0.035
        },
      },
    )
    // Once settled, drop the compositing hints so every word stops holding its own layer.
    controls.then(() => {
      for (const word of split.words) {
        word.style.willChange = 'auto'
        word.style.filter = 'none'
      }
    })
    return () => controls.stop()
  }, [split, inView, immediate, delay])

  const Tag = as
  return (
    <Tag ref={ref as RefObject<HTMLHeadingElement & HTMLParagraphElement>} id={id} className={className} data-split="pending">
      {children}
    </Tag>
  )
}
