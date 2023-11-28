import { useState, useEffect, RefObject } from 'react';

import { TargetType, useElementRef } from '../useElementRef';


export function useScrollableParent<Result extends RefObject<HTMLElement> | undefined>(
  target: TargetType,
): Result {
  const [targetRef] = useElementRef(target);
  const [parent, setParent] = useState<Result>();

  useEffect(() => {
    let next = targetRef.current?.parentElement;

    while (next) {
      if (isElementScrollable(next)) {
        setParent({ current: next } as Result);
        break;
      }

      next = next.parentElement;
    }
  }, [targetRef]);

  return parent as Result;
}

function isElementScrollable<E extends HTMLElement>(element: E): boolean {
  const { overflow, overflowX, overflowY } = getComputedStyle(element);

  return !['visible', 'hidden'].includes(overflow)
    && [overflow, overflowX, overflowY].some((ov) => ['auto', 'scroll'].includes(ov));
}
