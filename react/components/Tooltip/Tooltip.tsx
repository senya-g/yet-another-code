import cn from 'classnames';
import React, { memo } from 'react';

import { useElementRef, TargetType } from 'internal-package-name/hooks/useElementRef';
import { useSetScrollbarWidthVar } from 'internal-package-name/hooks/useSetScrollbarWidthVar';
import * as PopperJS from '@popperjs/core';

import { CSSTransitionComponent } from '~/components/CSSTransitionComponent';
import { PopperContainer, PopperContainerProps, Offset } from '~/components/PopperContainer';

import { useTooltipOpened, OpeningDelayParams } from './useTooltipOpened';

import styles from './Tooltip.module.scss';

export interface HeaderParams {
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  content?: string | React.ReactNode;
}

export type TooltipTextAlign = 'center' | 'left';

export interface TooltipProps {
  target: TargetType;
  placement?: PopperJS.Placement;
  offset?: PopperContainerProps['offset'];
  preventOverflowBoundary?: React.RefObject<HTMLElement>;
  preventOverflowPadding?: PopperContainerProps['preventOverflowPadding'];
  portalRoot?: React.RefObject<HTMLElement> | string;
  header?: HeaderParams;
  className?: string;
  bodyClassName?: string;
  contentClassName?: string;
  textAlign?: TooltipTextAlign;
  isDisabled?: boolean;
  isInteractive?: boolean;
  shouldCloseOnScroll?: boolean;
  shouldCloseParentsTooltips?: boolean;
  delay?: OpeningDelayParams;
  zIndex?: number;
  children?: React.ReactNode;
  onAnimationExited?: VoidFunction;
  onPopperState?: PopperContainerProps['onPopperState'];
}

export const Tooltip: React.FC<TooltipProps> = memo(
  function Tooltip({
    target,
    placement = 'bottom',
    offset = [0, 10] as Offset, // 10 = 6px (arrow height) + 4px (offset)
    preventOverflowBoundary,
    preventOverflowPadding,
    header,
    portalRoot,
    className,
    bodyClassName,
    contentClassName,
    textAlign = 'center',
    isDisabled,
    isInteractive,
    shouldCloseOnScroll = true,
    shouldCloseParentsTooltips,
    delay = { openMs: 300 },
    zIndex,
    children,
    onAnimationExited,
    onPopperState,
  }): JSX.Element {
    const [targetRef, targetElement] = useElementRef(target);
    const [containerRef] = useElementRef<HTMLDivElement>();
    const [bodyRef] = useElementRef<HTMLDivElement>();

    const {
      isOpened,
      onTooltipMouseEnter,
      onTooltipMouseLeave,
      onTooltipClick,
    } = useTooltipOpened({
      targetRef,
      bodyRef,
      isInteractive,
      shouldCloseOnScroll,
      shouldCloseParentsTooltips,
      delay,
    });

    useSetScrollbarWidthVar(containerRef, {
      variableName: '--tooltip-scrollbar-width',
      isEnabled: isOpened,
    });

    return (
      <React.Fragment>
        {targetElement}

        <CSSTransitionComponent
          in={isOpened && !isDisabled}
          timeout={50}
          onExited={onAnimationExited}
        >
          {(ref, { isVisible }) => (
            <PopperContainer
              arrowPadding={12}
              containerRef={ref}
              offset={offset}
              placement={placement}
              portalRoot={portalRoot}
              preventOverflowBoundary={preventOverflowBoundary}
              preventOverflowPadding={preventOverflowPadding}
              targetRef={targetRef}
              zIndex={zIndex}
              onClick={onTooltipClick}
              onMouseEnter={onTooltipMouseEnter}
              onMouseLeave={onTooltipMouseLeave}
              onPopperState={onPopperState}
            >
              {({ arrowRef, arrowStyles, placement }) => (
                <div
                  ref={containerRef}
                  className={cn(styles.container, className, {
                    [styles.visible]: isVisible,
                  })}
                >
                  <div
                    ref={arrowRef as React.RefObject<HTMLDivElement>}
                    className={styles.arrow}
                    data-popper-placement={placement}
                    style={arrowStyles}
                  />

                  <div
                    ref={bodyRef}
                    className={cn(styles.body, bodyClassName, {
                      [styles[`text-align-${textAlign}`]]: true,
                    })}
                  >
                    {!!header?.content && (
                      <div className={cn(styles.header, header.className)}>
                        {!!header.leftIcon && (
                          <div className={styles.headerIcon}>
                            {header.leftIcon}
                          </div>
                        )}

                        {header.content}

                        {!!header.rightIcon && (
                          <div className={styles.headerIcon}>
                            {header.rightIcon}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={cn(styles.content, contentClassName)}>
                      {children}
                    </div>
                  </div>
                </div>
              )}
            </PopperContainer>
          )}
        </CSSTransitionComponent>
      </React.Fragment>
    );
  },
);
