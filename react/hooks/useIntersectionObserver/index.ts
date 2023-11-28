import { RefObject, useEffect, useCallback } from 'react';


export interface UseIntersectionObserverParams {
  containerRef: RefObject<HTMLElement>,
  itemRef: RefObject<HTMLElement>,
  rootMargin?: string;
  threshold?: number;
  shouldDisconnectWhenIntersect?: boolean;
  onIsIntersected?: () => void;
  onIntersecting?: (isIntersection: boolean) => void;
}

export function useIntersectionObserver({
  containerRef,
  itemRef,
  rootMargin = '0px',
  threshold = 0.9,
  shouldDisconnectWhenIntersect = true,
  onIntersecting,
  onIsIntersected,
}: UseIntersectionObserverParams) {

  const handleIntersect: IntersectionObserverCallback = useCallback((entries, observer) => {
    const isIntersecting = entries.some((it) => it.isIntersecting);

    if (onIntersecting) {
      onIntersecting(isIntersecting);
    }

    if (isIntersecting && onIsIntersected) {
      onIsIntersected();
    }

    if (isIntersecting && shouldDisconnectWhenIntersect) {
      observer.disconnect();

      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    }
  }, [itemRef, onIntersecting, onIsIntersected, shouldDisconnectWhenIntersect]);

  useEffect(() => {
    const itemElement = itemRef.current;
    const containerElement = containerRef.current;

    if (!itemElement) {
      return void 0;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: containerElement,
      rootMargin,
      threshold,
    });

    observer.observe(itemElement);

    return () => {
      observer.unobserve(itemElement);
      observer.disconnect();
    };
  }, [handleIntersect, containerRef, rootMargin, itemRef, threshold]);
}
