import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  ...rest
}) => {
  return (
    <Component
      className={`w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

