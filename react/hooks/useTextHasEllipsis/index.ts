import { useState, useEffect } from 'react';

import { TargetType, useElementRef } from '../useElementRef';


export function useTextHasEllipsis(target: TargetType): boolean {
  const [hasEllipsis, setHasEllipsis] = useState(false);
  const [targetRef] = useElementRef(target);

  useEffect(() => {
    const elem = targetRef.current;

    if (!elem) {
      return undefined;
    }

    const observer = new ResizeObserver(() => {
      setHasEllipsis(elem.offsetWidth < elem.scrollWidth);
    });

    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
      observer.disconnect();
    };
  }, [targetRef]);

  return hasEllipsis;
}
