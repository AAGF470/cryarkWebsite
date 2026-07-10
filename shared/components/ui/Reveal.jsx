import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Reveal — scroll-reveal wrapper for any section or element.
//
// Pairs with styles/motion.css (loaded by the library barrel). The personality
// (speed, distance, easing, stagger step) comes from the --motion-* CSS vars,
// which recipes tune per client — so the same markup feels calm on
// editorial-paper and lively on bold-trade.
//
//   <Reveal><FeatureGrid …/></Reveal>                 fade-up (default)
//   <Reveal variant="slide-left" delay={120}>…        directional, delayed
//   <Reveal stagger><div>…cards…</div></Reveal>       children cascade in
//
// Props:
//   variant   'fade-up' | 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'blur'
//   stagger   boolean — animate direct children of the wrapped element in steps
//   delay     ms before the reveal starts (default 0)
//   threshold IntersectionObserver threshold (default 0.15)
//   once      reveal once and stay (default true)
//   as        wrapper tag (default 'div')
//
// Safety: pre-reveal hiding only activates under `html.js-motion`, which this
// component sets on mount — prerendered HTML and no-JS visitors always see
// content. prefers-reduced-motion renders everything revealed immediately.
// ---------------------------------------------------------------------------

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Reveal({
  variant = 'fade-up',
  stagger = false,
  delay = 0,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    // Arm the CSS (html.js-motion) only when JS is actually running.
    document.documentElement.classList.add('js-motion')
    if (reduced() || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            if (once) io.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  const cls = [
    stagger ? 'rv-stagger' : `rv rv--${variant}`,
    inView ? 'is-in' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref}
      className={cls}
      style={delay ? { '--rv-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
