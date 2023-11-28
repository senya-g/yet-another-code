import { useCallback } from 'react';

import { isNumber } from 'internal-package-name/utils/types';

import { InputMask, InputMaskFn } from '../types';
import { useInputMask } from '../useInputMask';

export interface IntegerInputMaskParams extends Omit<InputMask, 'fn'> {
  min?: number;
  max?: number;
}

export function useIntegerInputMask(params: IntegerInputMaskParams): InputMask {
  const mask: InputMaskFn = useCallback(({
    origValue,
    prevValue,
    blur,
  }) => {
    const isUnsigned = isNumber(params.min) && (params.min >= 0);

    const reg = isUnsigned
      ? /^(\d)*$/gm
      : /^-?(\d)*$/gm
    ;

    if (!reg.test(origValue)) {
      return {
        value: prevValue,
        isValid: false,
      };
    }

    const value = origValue
      .replace(/^0\d+/, '0')
      .replace(/^-0\d+/, '0')
    ;

    if (isNumber(params.min) && parseInt(value, 10) < params.min) {
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

    if (isNumber(params.max) && parseInt(value, 10) > params.max) {
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
