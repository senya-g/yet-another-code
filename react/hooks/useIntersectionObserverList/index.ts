import { RefObject, useEffect, useCallback } from 'react';


export interface UseIntersectionObserverListParams {
  containerRef: RefObject<Element>,
  refs: RefObject<Element>[],
  rootMargin?: string;
  threshold?: number;
  shouldDisconnectWhenIntersect?: boolean;
  onIntersected: (elements: Element[]) => void;
}

export function useIntersectionObserverList({
  containerRef,
  refs,
  rootMargin = '0px',
  threshold = 0.9,
  shouldDisconnectWhenIntersect = true,
  onIntersected,
}: UseIntersectionObserverListParams) {
  const handleIntersect: IntersectionObserverCallback = useCallback((entries, observer) => {
    const intersectingItems = entries.filter((it) => it.isIntersecting).map((it) => it.target);

    if (!intersectingItems.length) {
      return;
    }

    onIntersected(intersectingItems);

    if (shouldDisconnectWhenIntersect) {
      intersectingItems.forEach((item) => observer.unobserve(item));
    }
  }, [onIntersected, shouldDisconnectWhenIntersect]);

  useEffect(() => {
    const elements = refs.map((ref) => ref.current).filter(Boolean);
    const containerElement = containerRef.current;

    if (!elements.length) {
      return void 0;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: containerElement,
      rootMargin,
      threshold,
    });

    elements.forEach((elem) => observer.observe(elem as Element));

    return () => {
      elements.forEach((elem) => observer.unobserve(elem as Element));
      observer.disconnect();
    };
  }, [handleIntersect, containerRef, rootMargin, threshold, refs]);
}
