import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'p' | 'span' | 'div';
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  className = '',
  id,
  as: Component = 'span',
}) => {
  return (
    <Component
      id={id}
      className={`inline-block font-eyebrow text-[var(--color-brand-600)] uppercase tracking-[0.08em] font-semibold text-[12px] mb-2 ${className}`}
    >
      {children}
    </Component>
  );
};
