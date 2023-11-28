import { useCallback } from 'react';

import { isNumber } from 'internal-package-name/utils/types';

import { InputMaskFn, InputMask } from '../types';
import { useInputMask } from '../useInputMask';

export interface NumberInputMaskParams extends Omit<InputMask, 'fn'> {
  min?: number;
  max?: number;
}

export function useNumberInputMask(params: NumberInputMaskParams): InputMask {
  const mask: InputMaskFn = useCallback(({
    origValue,
    prevValue,
    blur,
  }) => {
    const isUnsigned = isNumber(params.min) && (params.min >= 0);

    const reg = isUnsigned
      ? /^\d*\.?\d*$/gm
      : /^-?\d*\.?\d*$/gm
    ;

    if (!reg.test(origValue) || /^-?0\d+/.test(origValue)) {
      return {
        value: prevValue,
        isValid: false,
      };
    }

    const value = origValue
      .replace(/^\./, '0.')
      .replace(/^-\./, '-0.')
    ;

    if (value.endsWith('.')) {
      if (blur) {
        return {
          value: value.replace(/\.$/m, ''),
          isValid: true,
        };
      }

      return {
        value,
        isValid: false,
      };
    }

    if (isNumber(params.min) && parseFloat(value) < params.min) {
      if (blur || (params.min < 0)) {
        return {
          value: params.min.toString(),
          isValid: true,
        };
      }

      return {
        value,
        isValid: false,
      };
    }

    if (isNumber(params.max) && parseFloat(value) > params.max) {
      return {
        value: params.max.toString(),
        isValid: true,
      };
    }

    return {
      value,
      isValid: true,
    };
  }, [params.max, params.min]);

  return useInputMask({ ...params, fn: mask });
}
