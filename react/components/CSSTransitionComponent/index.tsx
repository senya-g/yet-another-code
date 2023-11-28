import React from 'react';
import { TransitionStatus } from 'react-transition-group';
import CSSTransition, { CSSTransitionProps } from 'react-transition-group/CSSTransition';

import { useElementRef } from 'internal-package-name/hooks/useElementRef';

type OmitProperties<T, K extends keyof T> = {
  [Prop in keyof T as Exclude<Prop, K>]: T[Prop];
};

export interface CSSTransitionChildrenParams {
  status: TransitionStatus;
  isVisible: boolean;
}

export type CSSTransitionComponentProps = OmitProperties<CSSTransitionProps,
  | 'timeout'
  | 'classNames'
  | 'children'
  | 'nodeRef'
  | 'mountOnEnter'
  | 'unmountOnExit'
> & {
  timeout: CSSTransitionProps['timeout'];
  nodeRef?: React.RefObject<HTMLElement>;
  children?: (
    ref: React.RefObject<HTMLElement>,
    params: CSSTransitionChildrenParams,
  ) => React.ReactNode;
};

export function CSSTransitionComponent({
  timeout,
  children,
  nodeRef,
  addEndListener,
  ...props
}: CSSTransitionComponentProps): JSX.Element {
  const [ref] = useElementRef<HTMLElement>(nodeRef);

  return (
    <CSSTransition
      // @ts-ignore
      addEndListener={addEndListener} // eslint-disable-line @typescript-eslint/no-non-null-assertion
      nodeRef={ref}
      timeout={timeout}
      mountOnEnter
      unmountOnExit
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    >
      {(status) => children?.(ref, {
        status,
        isVisible: status === 'entered',
      }) as any}
    </CSSTransition>
  );
}
