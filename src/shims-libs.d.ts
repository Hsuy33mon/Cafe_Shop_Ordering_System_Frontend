// src/shims-libs.d.ts
export {}

type VoidFn = () => void

// Minimal, safe shapes (use unknown instead of any)
interface AOSLike {
  init: (options?: Record<string, unknown>) => void
}

interface WOWInstance {
  init: VoidFn
}
type WOWCtor = new () => WOWInstance

interface GSAPLike {
  registerPlugin: (...plugins: unknown[]) => void
}

declare global {
  // If you loaded jQuery via <script>, these come from @types/jquery
  const $: JQueryStatic | undefined
  const jQuery: JQueryStatic | undefined

  const AOS: AOSLike | undefined
  const WOW: WOWCtor | undefined
  const gsap: GSAPLike | undefined
  const ScrollTrigger: unknown
  const SplitText: unknown

  interface Window {
    $?: JQueryStatic
    jQuery?: JQueryStatic
    AOS?: AOSLike
    WOW?: WOWCtor
    gsap?: GSAPLike
    ScrollTrigger?: unknown
    SplitText?: unknown
  }
}
