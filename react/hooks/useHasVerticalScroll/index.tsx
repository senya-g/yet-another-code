import { RefObject, useEffect, useState } from 'react';


type UseHasVerticalScroll = (ref: RefObject<HTMLElement>) => [boolean];


export const useHasVerticalScroll: UseHasVerticalScroll = (ref) => {
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      const children = Array.from(element.children);

      let childrenHeight = 0;

      for (const child of children) {
        childrenHeight += getComputedHeight(child);
      }

      const parentHeight = getComputedHeight(element);

      const currentlyScrolling = childrenHeight > parentHeight;

      setHasScroll(currentlyScrolling);
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [hasScroll, ref]);

  return [hasScroll];
};

const getComputedHeight = (element: Element): number => {
  const height = parseFloat(window.getComputedStyle(element).getPropertyValue('height'));
  return Number.isNaN(height) ? 0 : height;
};
