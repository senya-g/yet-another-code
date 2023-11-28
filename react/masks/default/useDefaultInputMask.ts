import { useCallback } from 'react';

import { InputMaskFn, InputMaskParams, InputMask } from '../types';
import { useInputMask } from '../useInputMask';

export interface DefaultInputMaskParams extends Omit<InputMaskParams, 'fn'> {
}

export function useDefaultInputMask(params: DefaultInputMaskParams = {}): InputMask {
  const mask: InputMaskFn = useCallback(({ origValue }) => {
    return { value: origValue, isValid: true };
  }, []);

  return useInputMask({ ...params, fn: mask });
}
