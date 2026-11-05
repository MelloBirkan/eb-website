'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from './use-reduced-motion'

const CLASS = 'footer-wordmark text-center leading-[0.8] font-semibold tracking-[-0.06em]'

/**
 * Oversized wordmark that slides up out of the footer as the page ends. Under
 * Reduce Motion it is a plain, still paragraph: the scroll-linked values can
 * run on the compositor, so changing their ranges after mount would not stop them.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['38%', '0%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1])
  const word = (
    <>
      Even<span className="font-serif font-normal italic tracking-[-0.03em]">Better</span>
    </>
  )

  return (
    <div ref={ref} aria-hidden className="pointer-events-none mx-auto w-full max-w-[1240px] select-none overflow-hidden px-6 lg:px-10">
      {reduce ? (
        <p className={CLASS}>{word}</p>
      ) : (
        <motion.p style={{ y, opacity }} className={CLASS}>
          {word}
        </motion.p>
      )}
    </div>
  )
}
