import { SyntheticEvent } from 'react';

export type InputType = 'text' | 'password' | 'number' | 'integer';

export interface InputMaskParams {
  fn: InputMaskFn;
  isEnabled?: boolean;
}

export interface InputMask {
  fn: InputMaskFn;
  isEnabled: boolean;
}

export type InputMaskFn = (params: InputMaskHandlerParams) => InputMaskHandlerResult;

export interface InputMaskHandlerParams {
  origValue: string;
  prevValue: string;
  origCaret: [number, number];
  prevCaret: [number, number];
  // Если что-то не валидируется под маску, то пытаемся привести к ближайшему валидному значению
  blur: boolean;
}

export interface InputMaskHandlerResult {
  value: string;
  isValid: boolean;
  caret?: [number, number];
}


export type InputMaskEvent = SyntheticEvent<HTMLInputElement> & {
  currentTarget: {
    isMaskValid?: boolean;
  }
};

