'use client'

import Image from 'next/image'
import { motion, type Variants } from 'motion/react'
import { SPRING } from '../motion'
import { TEAM } from './team-data'

// Left, center, right. The center card sits on top.
const REST = [
  { x: '-56%', y: 22, rotate: -8 },
  { x: '0%', y: 0, rotate: 0 },
  { x: '56%', y: 22, rotate: 8 },
]
const SPREAD = [
  { x: '-68%', y: 10, rotate: -11 },
  { x: '0%', y: -10, rotate: 0 },
  { x: '68%', y: 10, rotate: 11 },
]

const card: Variants = {
  hidden: { opacity: 0, x: '0%', y: 70, rotate: 0, scale: 0.92 },
  rest: (i: number) => ({ opacity: 1, scale: 1, ...REST[i], transition: { ...SPRING.gentle, delay: 0.35 + i * 0.1 } }),
  spread: (i: number) => ({ opacity: 1, scale: 1, ...SPREAD[i], transition: SPRING.ui }),
}

/** The three photos as a fanned hand of cards. They spread a little on hover. */
export function TeamFan() {
  return (
    <motion.div
      aria-hidden
      initial="hidden"
      animate="rest"
      whileHover="spread"
      className="relative mx-auto aspect-[6/5] w-full max-w-[460px]"
    >
      {TEAM.map((m, i) => (
        <motion.figure
          key={m.name}
          custom={i}
          variants={card}
          className={`absolute top-[6%] left-1/2 w-[46%] -translate-x-1/2 overflow-hidden rounded-[24px] border border-line bg-card p-1.5 shadow-[0_30px_60px_-30px_rgba(15,37,35,.55)] ${
            i === 1 ? 'z-10' : ''
          }`}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[19px] bg-paper-2">
            <Image
              src={m.photo}
              alt=""
              fill
              loading="eager"
              placeholder="blur"
              sizes="(min-width: 1024px) 210px, 42vw"
              className="object-cover"
              style={{ objectPosition: m.focus }}
            />
          </div>
          <figcaption className={`flex items-center justify-between px-2 pt-2 pb-1 ${i === 2 ? 'flex-row-reverse' : ''}`}>
            <span className="text-[13.5px] font-semibold text-ink">{m.short}</span>
            <span className="font-mono text-[11.5px] text-ink-3">{m.role}</span>
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  )
}
