import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  workEmail: string;
  companyName: string;
  skuCount: string;
  role: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  skuCount?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    workEmail: '',
    companyName: '',
    skuCount: '100k-500k',
    role: 'Category Merchandiser',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  }, [onClose]);

  // Esc key and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      const timer = setTimeout(() => firstInputRef.current?.focus(), 100);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleBlur = (field: keyof FormState) => {
    const newErrors = { ...errors };
    if (field === 'fullName' && !form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (field === 'fullName') {
      delete newErrors.fullName;
    }

    if (field === 'workEmail') {
      if (!form.workEmail.trim()) {
        newErrors.workEmail = 'Enterprise work email is required';
      } else if (!validateEmail(form.workEmail)) {
        newErrors.workEmail = 'Please provide a valid corporate email address';
      } else {
        delete newErrors.workEmail;
      }
    }

    if (field === 'companyName' && !form.companyName.trim()) {
      newErrors.companyName = 'Company or retail brand name is required';
    } else if (field === 'companyName') {
      delete newErrors.companyName;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.workEmail.trim()) {
      newErrors.workEmail = 'Enterprise work email is required';
    } else if (!validateEmail(form.workEmail)) {
      newErrors.workEmail = 'Please provide a valid corporate email address';
    }
    if (!form.companyName.trim()) newErrors.companyName = 'Company or retail brand name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API demo request dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(11,18,32,0.65)] backdrop-blur-xs transition-opacity duration-[var(--dur-base)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 sm:p-8"
      >
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] transition-colors duration-[var(--dur-fast)] cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4" tabIndex={-1}>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-success-50)] text-[var(--color-success-600)] mb-2">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 id="demo-dialog-title" className="font-h3 text-[var(--text-heading)]">
              Demonstration Request Received
            </h3>
            <p className="font-body text-[var(--text-body)] max-w-md mx-auto">
              Our retail econometric specialists will reach out to <strong className="text-[var(--text-heading)]">{form.workEmail}</strong> within 4 business hours to prepare your historical data modeling audit.
            </p>
            <div className="pt-4">
              <Button variant="primary" size="md" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="font-eyebrow text-[var(--color-brand-600)] block mb-1">
                Custom Architecture Review
              </span>
              <h2 id="demo-dialog-title" className="font-h3 text-[var(--text-heading)] mb-2">
                Request an Enterprise Demo
              </h2>
              <p className="font-body-sm text-[var(--text-muted)]">
                Experience simulated elasticity modeling on your category SKU set with our senior solution engineers.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-[14px] font-semibold text-[var(--text-heading)] mb-1">
                  Full name <span className="text-[var(--text-muted)] font-normal">(required)</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full h-12 px-3.5 bg-[var(--bg-card)] border rounded-[var(--radius-sm)] text-[var(--text-heading)] placeholder-[var(--color-ink-400)] focus:border-2 focus:border-[var(--focus-ring)] focus:outline-none transition-colors ${
                    errors.fullName ? 'border-[var(--color-danger-600)]' : 'border-[var(--border-strong)] hover:border-[var(--color-ink-500)]'
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="flex items-center gap-1.5 text-[13px] text-[var(--color-danger-600)] mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="workEmail" className="block text-[14px] font-semibold text-[var(--text-heading)] mb-1">
                  Enterprise email <span className="text-[var(--text-muted)] font-normal">(required)</span>
                </label>
                <input
                  id="workEmail"
                  type="email"
                  value={form.workEmail}
                  onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
                  onBlur={() => handleBlur('workEmail')}
                  aria-invalid={!!errors.workEmail}
                  aria-describedby={errors.workEmail ? 'workEmail-error' : undefined}
                  placeholder="name@company.com"
                  className={`w-full h-12 px-3.5 bg-[var(--bg-card)] border rounded-[var(--radius-sm)] text-[var(--text-heading)] placeholder-[var(--color-ink-400)] focus:border-2 focus:border-[var(--focus-ring)] focus:outline-none transition-colors ${
                    errors.workEmail ? 'border-[var(--color-danger-600)]' : 'border-[var(--border-strong)] hover:border-[var(--color-ink-500)]'
                  }`}
                />
                {errors.workEmail && (
                  <p id="workEmail-error" className="flex items-center gap-1.5 text-[13px] text-[var(--color-danger-600)] mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{errors.workEmail}</span>
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-[14px] font-semibold text-[var(--text-heading)] mb-1">
                  Retail organization <span className="text-[var(--text-muted)] font-normal">(required)</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  onBlur={() => handleBlur('companyName')}
                  aria-invalid={!!errors.companyName}
                  aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                  placeholder="e.g. Global Retail Brands Inc."
                  className={`w-full h-12 px-3.5 bg-[var(--bg-card)] border rounded-[var(--radius-sm)] text-[var(--text-heading)] placeholder-[var(--color-ink-400)] focus:border-2 focus:border-[var(--focus-ring)] focus:outline-none transition-colors ${
                    errors.companyName ? 'border-[var(--color-danger-600)]' : 'border-[var(--border-strong)] hover:border-[var(--color-ink-500)]'
                  }`}
                />
                {errors.companyName && (
                  <p id="companyName-error" className="flex items-center gap-1.5 text-[13px] text-[var(--color-danger-600)] mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{errors.companyName}</span>
                  </p>
                )}
              </div>

              {/* SKU count select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="skuCount" className="block text-[14px] font-semibold text-[var(--text-heading)] mb-1">
                    Active Catalog Size
                  </label>
                  <select
                    id="skuCount"
                    value={form.skuCount}
                    onChange={(e) => setForm({ ...form, skuCount: e.target.value })}
                    className="w-full h-12 px-3 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius-sm)] text-[var(--text-heading)] focus:border-2 focus:border-[var(--focus-ring)] focus:outline-none transition-colors"
                  >
                    <option value="10k-50k">10,000 - 50,000 SKUs</option>
                    <option value="50k-100k">50,000 - 100,000 SKUs</option>
                    <option value="100k-500k">100,000 - 500,000 SKUs</option>
                    <option value="500k-2M">500,000 - 2,000,000 SKUs</option>
                    <option value="2M+">2,000,000+ SKUs</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="role" className="block text-[14px] font-semibold text-[var(--text-heading)] mb-1">
                    Primary Role
                  </label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-12 px-3 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius-sm)] text-[var(--text-heading)] focus:border-2 focus:border-[var(--focus-ring)] focus:outline-none transition-colors"
                  >
                    <option value="VP / Director Pricing">VP / Director Pricing</option>
                    <option value="Chief Merchandising Officer">Chief Merchandising Officer</option>
                    <option value="Category Merchandiser">Category Merchandiser</option>
                    <option value="Finance & Revenue Leader">Finance & Revenue Leader</option>
                    <option value="IT / Enterprise Architecture">IT / Enterprise Architecture</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Schedule demonstration
                </Button>
                <p className="text-[12px] text-[var(--text-muted)] text-center mt-3">
                  Under strict NDA. Enterprise data is never shared or used to train third-party models.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
