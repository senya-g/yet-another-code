import { useState, useMemo, useRef, useEffect } from 'react';

export interface ValidatorParams<Value> {
  message: string;
  fn: (value: Value) => boolean;
  isEnabled?: boolean;
  name?: string;
}

export interface Validator<Value> {
  readonly message: string | null;
  isEnabled: boolean;
  isValid: boolean;
  name: string;
  validate(value: Value): void;
}

export function useValidator<Value>(params: ValidatorParams<Value>): Validator<Value> {
  const _name = useRef(params.name ?? 'custom');
  const [isEnabled, setIsEnabled] = useState(params.isEnabled ?? true);
  const [isValid, setIsValid] = useState(false);
  const message = useRef(params.message);
  const validator = useRef<(value: Value) => boolean>(params.fn);

  useEffect(() => {
    setIsEnabled(params.isEnabled ?? true);
  }, [params.isEnabled]);

  return useMemo(() => ({
    name: _name.current,
    isEnabled,
    isValid,
    message: isValid ? null : message.current,
    validate: (value: Value): void => {
      setIsValid(!isEnabled || !!validator.current?.(value));
    },
  }), [isEnabled, isValid]);
}
