import { useEffect, useRef } from 'react';

/**
 * The header's 3D scene. three.js loads as its own chunk after the page has
 * painted, and without WebGL (or in tests) nothing renders at all.
 */
export function Hero3D() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || typeof window.WebGLRenderingContext === 'undefined') return;
    let scene: { dispose(): void } | null = null;
    let cancelled = false;
    import('./lib/labScene')
      .then(({ createLabScene }) => { if (!cancelled) scene = createLabScene(el); })
      .catch(() => { /* the header simply stays flat */ });
    return () => {
      cancelled = true;
      scene?.dispose();
    };
  }, []);
  return <div ref={host} className="lab-3d" aria-hidden="true" />;
}
