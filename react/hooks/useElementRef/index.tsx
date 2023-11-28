import React, { useState, useMemo, useEffect } from 'react';

import { isFunction, isObject, isString } from 'internal-package-name/utils/types';
import { waitUntil } from 'internal-package-name/utils/waiter';


export type TargetType =
  | string
  | React.ReactNode
  | React.RefObject<HTMLElement>
  | React.RefCallback<HTMLElement>
;

export type ElementRefResult<T extends HTMLElement> = [React.RefObject<T>, React.ReactNode];

export function useElementRef<T extends HTMLElement = HTMLElement>(
  target?: TargetType,
): ElementRefResult<T> {
  const initialResult = useMemo<ElementRefResult<T>>(() => getElementRef(target), [target]);
  const [result, setResult] = useState<ElementRefResult<T>>(initialResult);

  useEffect(() => {
    waitUntil(() => {
      const [ref, elem] = getElementRef(target);
      return !!elem || !!ref.current;
    }, {
      timeoutMs: 500,
      intervalMs: 0,
      throwOnTimeout: false,
    })
      .then(() => {
        const result = getElementRef(target) as ElementRefResult<T>;

        if (result[0].current) {
          setResult(result);
        }
      });
  }, [target]);

  const _result = result[0].current ? result : initialResult;

  useEffect(() => {
    if (_result[0].current && isFunction(target)) {
      target(_result[0].current);
    }
  }, [_result, target]);

  return _result;
}

function getElementRef<T extends HTMLElement>(target?: TargetType): ElementRefResult<T> {
  if (!target || isFunction(target)) {
    return [React.createRef<T>(), null];
  }

  if (React.isValidElement(target)) {
    const ref = React.createRef<T & HTMLDivElement>();

    return [
      ref,
      isString(target.type)
        ? React.cloneElement<any>(target, { ref })
        : <div ref={ref}>{target}</div>,
    ];
  }

  if (isObject(target) && 'current' in target) {
    return [target as React.RefObject<T>, null];
  }

  if (isString(target)) {
    const ref: React.MutableRefObject<T | null> = React.createRef();
    ref.current = typeof document === 'object' ? document.querySelector(target as string) : null;

    return [ref, null];
  }

  throw new Error('[getElementRef]: Unsupported target type');
}
