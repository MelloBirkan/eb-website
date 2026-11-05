'use client'

import { useLayoutEffect, type RefObject } from 'react'
import { animate, type Transition } from 'motion/react'
import { useReducedMotion } from './use-reduced-motion'

/** The clip is a string, so it runs on a duration-based spring. */
const CLIP: Transition = { type: 'spring', bounce: 0.16, visualDuration: 0.38 }

/**
 * Sliding tabs drawn as two copies of the same row. The top copy carries the
 * active look and is clipped to the active tab; moving the clip moves the pill
 * and the label color together, so a label never shows the wrong color while
 * the pill passes. Until this runs, CSS paints the active tab on its own (the
 * wrapper has no data-ready yet).
 *
 * The top copy must cover the padding box of the tabs' offsetParent, since the
 * clip is measured with offsetLeft and offsetTop. The clip takes the corner
 * radius of the tab itself.
 */
export function useClipTab(
  wrapRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLElement | null>,
  topRef: RefObject<HTMLElement | null>,
  active: number,
  selector: string,
) {
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const list = listRef.current
    const top = topRef.current
    if (!wrap || !list || !top) return
    const place = (slide: boolean) => {
      const tab = list.querySelectorAll<HTMLElement>(selector)[active]
      if (!tab) {
        delete wrap.dataset.ready
        return
      }
      const left = tab.offsetLeft
      const right = top.offsetWidth - left - tab.offsetWidth
      const bottom = top.offsetHeight - tab.offsetTop - tab.offsetHeight
      // rounded-full computes to a huge number, which the clip does not need.
      const radius = Math.min(parseFloat(getComputedStyle(tab).borderTopLeftRadius) || 0, 999)
      const clipPath = `inset(${tab.offsetTop}px ${right}px ${bottom}px ${left}px round ${radius}px)`
      const moving = slide && !reduce && wrap.dataset.ready === 'true'
      animate(top, { clipPath }, moving ? CLIP : { duration: 0 })
      wrap.dataset.ready = 'true'
    }
    place(true)
    // Labels change width when the web font arrives. The observer also reports
    // the first size right away, which must not cut the slide short.
    const measure = () => `${list.offsetWidth}x${list.offsetHeight}:${top.offsetWidth}x${top.offsetHeight}`
    let size = measure()
    const ro = new ResizeObserver(() => {
      const next = measure()
      if (next === size) return
      size = next
      place(false)
    })
    ro.observe(list)
    ro.observe(top)
    return () => ro.disconnect()
  }, [wrapRef, listRef, topRef, active, selector, reduce])
}
