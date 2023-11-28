import { useEffect } from 'react';

import { TargetType, useElementRef } from '../useElementRef';


export function useSetViewportHeightVar(
  target: TargetType,
  variableName = '--viewport-height',
): void {
  const [targetRef] = useElementRef(target);

  useEffect(() => {
    const handler = () => {
      targetRef.current?.style.setProperty(variableName, `${window.innerHeight}px`);
    };

    window.addEventListener('resize', handler);
    handler();

    return () => window.removeEventListener('resize', handler);
  }, [targetRef, variableName]);
}
