import { useEffect, useState, useRef } from 'react';


export interface UseOutsideClickParams {
  targetRef: React.RefObject<HTMLElement>;
  clickableRefs?: React.RefObject<HTMLElement>[];
  isEnabled?: boolean;
  onClick: (e: Event) => void,
}

export function useOutsideClick({
  isEnabled,
  targetRef,
  clickableRefs = [],
  onClick,
}: UseOutsideClickParams): void {
  const timer = useRef<number>();
  const [isHookEnabled, setIsHookEnabled] = useState(false);

  useEffect(() => {
    window.clearTimeout(timer.current);

    if (isEnabled) {
      // Во внешнем коде, во время открытия попапа и т.п, инициализируется
      // outsideClick обработчик, который сразу же и срабатывает, закрывая попап.
      // Это бывает, например, когда модалка открывается на событие onChange в инпуте, а не на onClick.
      // Кажется, что если проставлять флаг асинхронно, то мы избежим этой проблемы и ничего
      // этим не сломаем. Зато избавимся от необходимости думать об этом при использовании хука
      timer.current = window.setTimeout(() => setIsHookEnabled(isEnabled));
    } else {
      setIsHookEnabled(false);
    }

    return () => {
      window.clearTimeout(timer.current);
    };
  }, [isEnabled]);

  useEffect(() => {
    const ref = targetRef.current;

    if (!ref || !isHookEnabled) {
      return undefined;
    }

    const handler = (e: Event) => {
      const refs: React.RefObject<HTMLElement>[] = [targetRef]
        .concat(clickableRefs)
        .filter(Boolean);

      const isClickOutside = (e: Event) => {
        return !refs.some((ref) => ref.current?.contains(e.target as Node));
      };

      if (isHookEnabled && isClickOutside(e)) {
        onClick(e);
      }
    };

    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, [clickableRefs, isHookEnabled, onClick, targetRef]);
}
