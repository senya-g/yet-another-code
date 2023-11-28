import { useState, useEffect, useMemo } from 'react';

import { Validator } from './useValidator';

export interface FieldValidationParams<Value> {
  okMessage?: string;
  validators: Validator<Value>[];
}

export interface FieldValidation<Value> {
  isValid: boolean;
  message: string | null;
  fieldState?: 'valid' | 'error';
  validators: Validator<Value>[];
  validate: (value: Value) => void;
  setIsValidated: (isValidated: boolean) => void;
}

export function useFieldValidation<Value>(
  params: FieldValidationParams<Value>,
): FieldValidation<Value> {
  const [isValidated, setIsValidated] = useState(false);
  const [okMessage, setOkMessage] = useState(params.okMessage);
  const [validators, setValidators] = useState<Validator<Value>[]>(params.validators);

  useEffect(() => {
    setOkMessage(params.okMessage);
    setValidators(params.validators);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.okMessage, JSON.stringify(params.validators)]);

  const isValid = useMemo(() => validators.every((v) => v.isValid), [validators]);

  const message = useMemo(() => {
    if (isValid) {
      return okMessage ?? null;
    }

    return validators
      .filter((v) => !v.isValid)
      .map((v) => v.message)[0]
    ?? null;
  }, [isValid, okMessage, validators]);

  const fieldState = useMemo(() => {
    if (!isValidated) {
      return undefined;
    }

    if (isValid && !message) {
      return undefined;
    }

    return isValid ? 'valid' : 'error';
  }, [isValid, isValidated, message]);

  return useMemo(() => {
    return {
      isValid,
      message,
      fieldState,
      validators,
      validate: (value: Value) => validators.forEach((validator) => {
        validator.validate(value);
      }),
      setIsValidated,
    };
  }, [fieldState, isValid, message, validators]);
}
