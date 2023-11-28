import { useEffect, useState } from 'react';

import { TargetType, useElementRef } from '../useElementRef';


export interface UseSetScrollbarWidthVarOptions {
  isEnabled?: boolean;
  variableName?: string;
}

export function useSetScrollbarWidthVar(
  target: TargetType,
  opts: UseSetScrollbarWidthVarOptions = {},
): void {
  const [width, setWidth] = useState(0);
  const [targetRef] = useElementRef(target);

  const isEnabled = opts.isEnabled ?? true;
  const variableName = opts.variableName ?? '--scrollbar-width';

  useEffect(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.overflow = 'scroll';
    document.body.appendChild(div);

    setWidth(div.offsetWidth - div.clientWidth);

    document.body.removeChild(div);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    targetRef.current?.style.setProperty(variableName, `${width}px`);
  }, [isEnabled, targetRef, variableName, width]);
}
