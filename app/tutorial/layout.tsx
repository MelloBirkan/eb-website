import { GuideTabs } from '../../components/site/guide/guide-tabs'

/* A link straight to a step (/tutorial/plugins/ios#auditoria) is answered by the
   server with the first step, and the browser switches to the right one once the
   script loads. Until then the steps stay hidden, so the wrong step never shows.
   The timer gives them back if the script never runs. */
const BOOT = `(function(){try{if(location.hash.length>1){var s=document.createElement('style');s.id='guide-boot';s.textContent='.guide-stage{visibility:hidden}';document.head.appendChild(s);setTimeout(function(){s.remove()},4000)}}catch(e){}})()`

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="relative isolate">
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <div aria-hidden className="grid-paper pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-12%] -z-10 size-[600px] rounded-full bg-[radial-gradient(closest-side,var(--s-mint),transparent)] opacity-60"
      />
      {/* The tabs stay mounted while you move between the guides, so the pill slides. */}
      <div className="wrap pt-8 sm:pt-12">
        <GuideTabs />
      </div>
      {children}
    </main>
  )
}
