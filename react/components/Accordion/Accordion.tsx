import cn from 'classnames';
import React from 'react';

import { AccordionItemData, AccordionItem } from './AccordionItem';
import { AccordionAdaptiveDevice, AccordionVariant } from './types';
import { AccordionState } from './useAccordion';

import styles from './Accordion.module.scss';

export type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  items: AccordionItemData[];
  state: AccordionState;
  device?: AccordionAdaptiveDevice;
  variant?: AccordionVariant;
  className?: string;
};

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion({
    items,
    state,
    device = 'desktop',
    variant = 'a',
    className,
    ...props
  }, ref): JSX.Element {
    return (
      <div
        ref={ref}
        className={cn(styles.container, className)}
        {...props} // eslint-disable-line react/jsx-props-no-spreading
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            device={device}
            isExpanded={state.isExpanded(item.id)}
            item={item}
            variant={variant}
            onToggle={state.onToggle}
          />
        ))}
      </div>
    );
  },
);
