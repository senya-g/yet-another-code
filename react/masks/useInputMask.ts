import { useState, useRef, useEffect, useMemo } from 'react';

import { InputMaskParams } from './types';

export function useInputMask(params: InputMaskParams) {
  const [isEnabled, setIsEnabled] = useState(true);
  const mask = useRef(params.fn);

  useEffect(() => {
    setIsEnabled(params.isEnabled ?? true);
  }, [params.isEnabled]);

  return useMemo(() => ({
    isEnabled,
    fn: mask.current,
  }), [isEnabled]);
}
