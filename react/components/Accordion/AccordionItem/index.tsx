import cn from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

import { useElementRef } from 'internal-package-name/hooks/useElementRef';

import { CSSTransitionComponent } from '../../CSSTransitionComponent';
import { AccordionAdaptiveDevice, AccordionVariant } from '../types';

import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import PlusIcon from '~/assets/images/icons/plus.svg';

import styles from './AccordionItem.module.scss';

export interface AccordionItemData {
  id: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export interface AccordionItemProps {
  item: AccordionItemData;
  device: AccordionAdaptiveDevice;
  variant: AccordionVariant;
  isExpanded: boolean;
  animationDuration?: number;
  onToggle: (id: string) => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = React.memo(
  function AccordionItem({
    item,
    device,
    variant,
    isExpanded: _isExpanded,
    animationDuration = 200, // in ms
    onToggle,
  }): JSX.Element {
    const [containerRef] = useElementRef<HTMLDivElement>();
    const [contentRef] = useElementRef<HTMLDivElement>();

    // Нужно для того, чтобы пофиксить проблему, когда CSSTransition не отрабатывает, если при
    // первом рендере прилетает флаг isExpanded=true
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
      if (_isExpanded !== isExpanded) {
        setIsExpanded(_isExpanded);
      }

      return () => setIsExpanded(false);
    }, [_isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleToggle = useCallback((event: React.MouseEvent) => {
      item.onClick?.(event);

      if (item.content) {
        onToggle(item.id);
      }
    }, [item, onToggle]);

    const handleContentUiState = useCallback((
      height: number,
      opacity: number,
    ) => {
      setTimeout(() => {
        const contentElement = contentRef.current;

        if (!contentElement) {
          return;
        }

        contentElement.style.height = `${height}px`;
        contentElement.style.opacity = `${opacity}`;
      });
    }, [contentRef]);

    useEffect(() => {
      containerRef.current?.style.setProperty('--animation-duration', `${animationDuration}ms`);
    }, [containerRef, animationDuration]);

    const ButtonIcon = (() => {
      switch (variant) {
        case 'a':
          return PlusIcon;
        default:
          return ChevronDownIcon;
      }
    })();

    return (
      <div
        ref={containerRef}
        className={cn(styles.container, item.className, {
          [styles.expanded]: isExpanded,
          [styles[`variant-${variant}`]]: true,
          [styles[device]]: true,
        })}
      >
        <div
          className={cn(styles.title, item.titleClassName)}
          onClick={handleToggle}
        >
          {item.title}

          {!!item.content && (
            <ButtonIcon
              className={cn(styles.button, {
                [styles.expanded]: isExpanded,
              })}
              role="button"
              tabIndex={0}
            />
          )}
        </div>

        <CSSTransitionComponent
          in={isExpanded}
          nodeRef={contentRef}
          timeout={animationDuration}
          onEnter={() => handleContentUiState(contentRef.current?.scrollHeight ?? 0, 1)}
          onExiting={() => handleContentUiState(0, 0)}
        >
          {(ref, { status }) => {
            return (
              <div
                ref={ref as React.RefObject<HTMLDivElement>}
                className={cn(styles.content, {
                  [`${item.contentClassName}`]: !!item.contentClassName,
                  [styles[status]]: ['exiting', 'exited'].includes(status),
                })}
              >
                <div className={styles.innerContent}>
                  {item.content}
                </div>
              </div>
            );
          }}
        </CSSTransitionComponent>
      </div>
    );
  },
);
