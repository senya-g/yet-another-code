import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react';

export interface UseTooltipOpenedParams {
  targetRef: React.RefObject<HTMLElement>;
  bodyRef: React.RefObject<HTMLElement>;
  delay?: OpeningDelayParams;
  isInteractive?: boolean;
  shouldCloseOnScroll?: boolean;
  shouldCloseParentsTooltips?: boolean;
}

export interface UseTooltipOpenedResult {
  isOpened: boolean;
  onTooltipMouseEnter: React.MouseEventHandler,
  onTooltipMouseLeave: React.MouseEventHandler,
  onTooltipClick: React.MouseEventHandler,
}

export function useTooltipOpened({
  delay,
  targetRef,
  bodyRef,
  isInteractive,
  shouldCloseOnScroll,
  shouldCloseParentsTooltips = true,
}: UseTooltipOpenedParams): UseTooltipOpenedResult {
  const [isTargetHovered, setIsTargetHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  const [isOpened, setIsOpened] = useOpeningDelay(delay);

  useEffect(() => {
    setIsOpened(isTargetHovered || isTooltipHovered);
  }, [isTooltipHovered, isTargetHovered, setIsOpened]);

  useEffect(() => {
    const target = targetRef.current;

    const handlerEnter = (e: Event) => {
      e.stopPropagation();
      setIsTargetHovered(true);

      if (shouldCloseParentsTooltips) {
        triggerClosingAnotherTooltips(e.currentTarget as HTMLElement);
      }
    };

    const handlerLeave = (e: Event) => {
      e.stopPropagation();
      setIsTargetHovered(false);
    };

    const handleCloseTooltip = (event: Event) => {
      if ((event as CustomEvent).detail !== target) {
        setIsTargetHovered(false);
      }
    };

    target?.addEventListener('mouseenter', handlerEnter);
    target?.addEventListener('mousemove', handlerEnter);
    target?.addEventListener('mouseleave', handlerLeave);
    document?.addEventListener('close-tooltip', handleCloseTooltip);

    return () => {
      target?.removeEventListener('mouseenter', handlerEnter);
      target?.removeEventListener('mousemove', handlerEnter);
      target?.removeEventListener('mouseleave', handlerLeave);
      document?.removeEventListener('close-tooltip', handleCloseTooltip);
    };
  }, [shouldCloseParentsTooltips, targetRef]);

  useEffect(() => {
    if (!shouldCloseOnScroll) {
      return undefined;
    }

    const handler = (e: Event) => {
      if (e.target === bodyRef.current) {
        return;
      }

      setIsTargetHovered(false);
      setIsTooltipHovered(false);
      setIsOpened(false, true);
    };

    document.addEventListener('scroll', handler, true);
    return () => document.removeEventListener('scroll', handler, true);
  }, [shouldCloseOnScroll, setIsOpened, bodyRef]);

  const handleTooltipMouseEnter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (isInteractive) {
      setIsTooltipHovered(true);
    }
  }, [isInteractive]);

  const handleTooltipMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if (isInteractive) {
      setIsTooltipHovered(false);
    }
  }, [isInteractive]);

  const handleTooltipClick = useCallback((e: React.MouseEvent) => {
    if (isInteractive) {
      e.stopPropagation();
    }
  }, [isInteractive]);

  return {
    isOpened,
    onTooltipMouseEnter: handleTooltipMouseEnter,
    onTooltipMouseLeave: handleTooltipMouseLeave,
    onTooltipClick: handleTooltipClick,
  };
}

export interface OpeningDelayParams {
  openMs?: number;
  closeMs?: number;
}

function useOpeningDelay(
  params: OpeningDelayParams = {},
): [boolean, (isOpened: boolean, immediate?: boolean) => void] {
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = useCallback((isImmediate: boolean) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    if (isImmediate) {
      setIsOpened(true);
      return;
    }

    openTimer.current = window.setTimeout(() => {
      setIsOpened(true);
    }, params.openMs ?? 0);
  }, [params.openMs]);

  const handleClose = useCallback((isImmediate: boolean) => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    if (isImmediate) {
      setIsOpened(false);
      return;
    }

    closeTimer.current = window.setTimeout(() => {
      setIsOpened(false);
    }, params.closeMs ?? 0);
  }, [params.closeMs]);

  const handleSetOpened = useCallback(
    (isOpened: boolean, isImmediate = false) => isOpened
      ? handleOpen(isImmediate)
      : handleClose(isImmediate),
    [handleClose, handleOpen],
  );

  return [
    isOpened,
    handleSetOpened,
  ];
}

function triggerClosingAnotherTooltips(target: HTMLElement | null): void {
  document?.dispatchEvent(new CustomEvent('close-tooltip', { bubbles: true, detail: target }));
}
