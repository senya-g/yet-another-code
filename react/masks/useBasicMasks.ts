import { useMemo } from 'react';

import { useDefaultInputMask } from './default/useDefaultInputMask';
import { useIntegerInputMask } from './integer/useIntegerInputMask';
import { useNumberInputMask } from './number/useNumberInputMask';
import { InputType, InputMaskEvent, InputMask } from './types';


export interface InputBasicMasksParams {
  mask?: InputMask;
  type?: InputType;
  min?: number;
  max?: number;
  onChange?: (e: InputMaskEvent) => void;
  onBlur?: (e: InputMaskEvent) => void;
}

export function useBasicMasks(params: InputBasicMasksParams) {
  const numberMask = useNumberInputMask({
    isEnabled: params.type === 'number',
    min: params.min,
    max: params.max,
  });

  const integerMask = useIntegerInputMask({
    isEnabled: params.type === 'integer',
    min: params.min,
    max: params.max,
  });

  const defaultMask = useDefaultInputMask();

  return useMemo(() => {
    if (params.mask && params.mask.isEnabled) {
      return params.mask;
    }

    if (params.type === 'integer' && integerMask.isEnabled) {
      return integerMask;
    }

    if (params.type === 'number' && numberMask.isEnabled) {
      return numberMask;
    }

    return defaultMask;
  }, [defaultMask, integerMask, numberMask, params.mask, params.type]);
}
