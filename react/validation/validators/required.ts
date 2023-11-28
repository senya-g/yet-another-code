import { useCallback } from 'react';

import { isNull, isString } from 'internal-package-name/utils/types';

import { useValidator, ValidatorParams } from '../useValidator';

export const REQUIRED_VALIDATOR = 'required';

export interface RequiredValidatorParams<T> extends Omit<ValidatorParams<T>, 'fn' | 'name'> {}

export function useRequiredValidator<T>(params: RequiredValidatorParams<T>) {
  const fn = useCallback((value: T): boolean => {
    return !Number.isNaN(value)
      && !isNull(value)
      && (!isString(value) || value.trim().length > 0)
      && (!Array.isArray(value) || !!value.length)
    ;
  }, []);

  return useValidator<T>({ name: REQUIRED_VALIDATOR, fn, ...params });
}
