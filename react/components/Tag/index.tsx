import cn from 'classnames';
import React from 'react';

import { isFunction } from 'internal-package-name';

import styles from './Tag.module.scss';

export const TAG_COLORS = [
  'red',
  'yellow',
  'green',
  'purple',
  'light-purple',
  'pink',
  'blue',
  'gray',
  'bright-mint',
  'pink-blue-gradient',
] as const;

export type TagColor = typeof TAG_COLORS[number];
export type TagSize = 'sm' | 'lg';

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  size?: TagSize;
  color?: TagColor;
} & ({
  variant?: 'filled' | 'transparent',
  color: Extract<
    TagColor,
    | 'red'
    | 'green'
    | 'purple'
    | 'light-purple'
    | 'pink'
    | 'gray'
  >
} | {
  variant?: undefined,
  color: Extract<
    TagColor,
    | 'yellow'
    | 'blue'
    | 'pink-blue-gradient'
    | 'bright-mint'
  >
}) & ({
  children: React.ReactNode | string;
  icon?: React.ReactNode | (() => React.ReactNode);
} | {
  children?: React.ReactNode | string;
  icon: React.ReactNode | (() => React.ReactNode);
});

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag({
   className,
   size = 'lg',
   color,
   variant,
   children,
   icon,
   ...props
  }, ref): JSX.Element {
    return (
      <span
        ref={ref}
        className={cn(styles.container, className, {
          [styles[`size-${size}`]]: true,
          [styles[`${color}`]]: !!color,
          [styles[`${variant}`]]: !!variant,
          [styles.iconOnly]: !children,
        })}
        {...props} // eslint-disable-line react/jsx-props-no-spreading
      >
        {!!icon && (
          <span className={styles.icon}>
            {isFunction(icon) ? icon() : icon}
          </span>
        )}
        {!!children && (
          <span className={styles.content}>
            {children}
          </span>
        )}
      </span>
    );
  },
);
