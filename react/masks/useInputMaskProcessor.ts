import {
  useMemo,
  useRef,
  useCallback,
  ChangeEvent,
  FocusEvent
} from 'react';

import { InputType, InputMaskEvent } from './types';
import { InputBasicMasksParams, useBasicMasks } from './useBasicMasks';

export interface InputMaskProcessState {
  type: Include<InputType, 'text' | 'password'>;
  change: (e: ChangeEvent<HTMLInputElement>) => void;
  blur: (e: FocusEvent<HTMLInputElement>) => void;
}

export function useInputMaskProcessor(
  params: InputBasicMasksParams,
): InputMaskProcessState {
  const prevState = useRef({
    value: '',
    caret: [0, 0] as [number, number],
    isValid: true,
  });

  const mask = useBasicMasks(params);

  const validate = useCallback((e: InputMaskEvent, blur: boolean) => {
    const target = e.currentTarget as InputMaskEvent['currentTarget'];

    const origCaret: [number, number] = [
      target.selectionStart ?? 0,
      target.selectionEnd ?? 0,
    ];

    const state = mask.fn({
      origValue: target.value,
      prevValue: prevState.current.value,
      origCaret,
      prevCaret: prevState.current.caret,
      blur,
    });

    target.value = state.value;
    target.isMaskValid = state.isValid;

    const caret = state.caret || origCaret;

    e.currentTarget.value = state.value;
    e.currentTarget.isMaskValid = state.isValid;

    if ((origCaret[0] !== caret[0]) || (origCaret[1] !== caret[1])) {
      e.currentTarget.setSelectionRange(...caret);
    }

    prevState.current = {
      value: state.value,
      caret,
      isValid: state.isValid,
    };
  }, [mask]);

  const handleChange = useCallback((e: InputMaskEvent) => {
    validate(e, false);
    params.onChange?.(e);
  }, [params, validate]);

  const handleBlur = useCallback((e: InputMaskEvent) => {
    const { value } = e.currentTarget;

    validate(e, true);

    if (e.currentTarget.value !== value) {
      params.onChange?.(e);
    }

    params.onBlur?.(e);
  }, [params, validate]);

  return useMemo(() => {
    return {
      type: (() => {
        switch (params.type) {
          case 'integer':
          case 'number':
            return 'text';
          default:
            return params.type ?? 'text';
        }
      })(),
      change: handleChange,
      blur: handleBlur,
    };
  }, [handleBlur, handleChange, params.type]);
}


