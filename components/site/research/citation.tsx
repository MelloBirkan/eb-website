'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CopyButton } from '../copy-button'
import { EASE_OUT } from '../motion'
import { BIBTEX, CITATION_TEXT } from './paper'
import { Segmented } from './segmented'

type Format = 'bibtex' | 'texto'

/** BibTeX or a plain reference, each with a copy button. */
export function Citation() {
  const [format, setFormat] = useState<Format>('bibtex')
  const text = format === 'bibtex' ? BIBTEX : CITATION_TEXT
  return (
    <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-night text-on-night shadow-[0_40px_100px_-50px_rgba(5,14,13,.7)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5">
        <Segmented<Format>
          label="Formato da citação"
          value={format}
          onChange={setFormat}
          tone="night"
          options={[
            { id: 'bibtex', label: 'BibTeX' },
            { id: 'texto', label: 'Texto' },
          ]}
        />
        <CopyButton text={text} label={format === 'bibtex' ? 'a citação em BibTeX' : 'a citação em texto'} tone="night" className="size-10" />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.pre
          key={format}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="p-5 font-mono text-[12.5px] leading-[1.75] whitespace-pre-wrap text-on-night [overflow-wrap:anywhere] sm:p-6 sm:text-[13.5px]"
        >
          <code>{text}</code>
        </motion.pre>
      </AnimatePresence>
    </div>
  )
}
