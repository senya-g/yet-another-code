import { useEffect } from 'react';

import { TargetType, useElementRef } from '../useElementRef';


export interface UseSetTopOffsetVarOptions {
  isEnabled?: boolean;
  variableName?: string;
}

export function useSetTopOffsetVar(
  target: TargetType,
  opts: UseSetTopOffsetVarOptions = {},
): void {
  const [targetRef] = useElementRef(target);

  const isEnabled = opts.isEnabled ?? true;
  const variableName = opts.variableName || '--top-offset';

  useEffect(() => {
    const elem = targetRef.current;

    if (!elem || !isEnabled) {
      return undefined;
    }

    const handler = () => {
      elem.style.setProperty(variableName, `${elem.getBoundingClientRect().top}px`);
    };

    const observer = new ResizeObserver(() => handler());
    observer.observe(elem);

    return () => {
      observer.unobserve(elem);
      observer.disconnect();
    };
  }, [isEnabled, targetRef, variableName]);
}
