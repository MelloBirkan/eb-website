'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from './icons'
import { SPRING } from './motion'

type Props = {
  text: string
  /** What is being copied, read by screen readers: "Copiar <label>". */
  label: string
  tone?: 'light' | 'night'
  className?: string
}

export function CopyButton({ text, label, tone = 'light', className = '' }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The text stays selectable.
    }
  }

  const base =
    tone === 'night'
      ? 'border-white/12 text-on-night-2 hover:bg-white/10 hover:text-on-night'
      : 'border-line-2 text-ink-2 hover:bg-paper-2 hover:text-ink'

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar ${label}`}
      className={`hit relative grid size-8 shrink-0 place-items-center rounded-full border transition-[background-color,color,scale] active:scale-90 ${base} ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? 'ok' : 'copy'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={SPRING.lively}
          className={copied ? (tone === 'night' ? 'text-glow' : 'text-brand') : ''}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copiado' : ''}
      </span>
    </button>
  )
}
