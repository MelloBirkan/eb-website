import { Logo } from './tutorial-primitives'

export function SiteFooter() {
  return (
    <footer className="eb-footer">
      <div className="eb-footer-inner">
        <span className="eb-footer-brand">
          <span className="eb-brand-mark" style={{ width: 22, height: 22 }}><Logo /></span>
          EvenBetter
        </span>
        <span className="eb-footer-sep">·</span>
        <a
          href="https://github.com/MelloBirkan/EvenBetterFramework"
          target="_blank"
          rel="noopener noreferrer"
          className="eb-footer-link"
        >
          GitHub
        </a>
        <span className="eb-footer-sep">·</span>
        <span className="eb-footer-muted">TCC II · FCI / Mackenzie · 2026</span>
        <span className="eb-footer-colophon">
          Composto em <em>Geist</em> &amp; <em>Instrument Serif</em>.
        </span>
      </div>
    </footer>
  )
}
