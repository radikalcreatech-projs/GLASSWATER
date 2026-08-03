import { useEffect, useRef, useState, RefObject } from 'react';

/**
 * Returns a ref to attach to an element and a boolean indicating whether
 * the element has entered the viewport (triggering image load).
 * Uses IntersectionObserver so background images only load when visible.
 */
export function useLazyBackground(src: string): [RefObject<HTMLDivElement>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return [ref, loaded ? src : ''];
}
