import React from 'react';
import { ArrowRight, Play, Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost-play' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  uppercase?: boolean;
  icon?: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  uppercase = false,
  icon,
  className = '',
  disabled,
  asAnchor = false,
  href,
  ...rest
}) => {
  // Size classes
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-10 px-4 min-h-[44px] min-w-[44px] text-[14px]',
    md: 'h-12 px-6 min-h-[44px] min-w-[44px] text-[15px]',
    lg: 'h-[52px] px-8 min-h-[48px] min-w-[48px] text-[15px]',
  };

  // Base styling adhering to tokens
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-[var(--radius-sm)] transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2';

  // Variant styling matching Competera signature green & dark UI
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-[var(--color-brand-600)] text-[#000000] hover:bg-[var(--color-brand-700)] hover:shadow-[0_0_20px_rgba(0,208,108,0.35)] hover:-translate-y-[1px] active:bg-[var(--color-brand-800)] active:translate-y-0 disabled:bg-[var(--color-ink-300)] disabled:text-[var(--color-ink-500)] disabled:cursor-not-allowed disabled:transform-none';
      break;
    case 'secondary':
      variantClasses =
        'bg-transparent border border-[var(--border-strong)] text-[var(--text-heading)] hover:border-[var(--color-brand-600)] hover:bg-[var(--color-brand-50)]/40 active:bg-[var(--color-brand-100)]/20 disabled:opacity-50 disabled:cursor-not-allowed';
      break;
    case 'ghost-play':
      variantClasses =
        'group bg-transparent border border-[var(--border-strong)] hover:border-[var(--color-brand-600)] text-[var(--text-heading)] hover:bg-[var(--color-brand-50)]/30 disabled:opacity-50';
      break;
    case 'link':
      variantClasses =
        'group bg-transparent p-0 min-h-[44px] h-auto text-[var(--color-brand-600)] hover:underline underline-offset-[3px] active:text-[var(--color-brand-800)] disabled:text-[var(--text-muted)]';
      break;
  }

  const casingClass = uppercase ? 'uppercase tracking-[0.05em]' : '';

  const content = (
    <>
      {isLoading ? (
        <span className="flex items-center gap-2" aria-busy="true">
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
          <span>Processing</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {variant === 'ghost-play' && (
            <Play className="w-4 h-4 text-[var(--color-brand-600)] fill-current transition-transform duration-[var(--dur-fast)] group-hover:scale-110" aria-hidden="true" />
          )}
          {icon && <span aria-hidden="true">{icon}</span>}
          <span>{children}</span>
          {variant === 'link' && (
            <ArrowRight className="w-4 h-4 text-current transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" aria-hidden="true" />
          )}
        </span>
      )}
    </>
  );

  if (asAnchor && href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${variant !== 'link' ? sizeClasses[size] : ''} ${variantClasses} ${casingClass} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variant !== 'link' ? sizeClasses[size] : ''} ${variantClasses} ${casingClass} ${className}`}
      {...rest}
    >
      {content}
    </button>
  );
};
