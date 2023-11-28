import debounce from 'lodash/debounce';
import { useEffect } from 'react';


const HANDLERS_VAR = '__hooks_usePressEscStack_handlers';

type Handler = (e: KeyboardEvent) => void;

const getHandlers = (): Handler[] => {
  // @ts-ignore
  window[HANDLERS_VAR] = window[HANDLERS_VAR] || [];

  // @ts-ignore
  return window[HANDLERS_VAR];
};

const setHandlers = (handlers: Handler[]) => {
  // @ts-ignore
  window[HANDLERS_VAR] = handlers;
};

export interface UsePressEscStackParams {
  isEnabled?: boolean;
  onPress: (e: KeyboardEvent) => void;
}

const handleEscape = debounce((e: KeyboardEvent) => {
  if (e.key !== 'Escape' || !getHandlers().length) {
    return;
  }

  getHandlers()[0](e);
});

export function usePressEscStack({
  isEnabled = true,
  onPress,
}: UsePressEscStackParams): void {
  useEffect(() => {
    if (!getHandlers().length) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      if (!getHandlers().length) {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    getHandlers().unshift(onPress);

    return () => {
      setHandlers(getHandlers().filter((hr) => hr !== onPress));
    };
  }, [isEnabled, onPress]);
}
