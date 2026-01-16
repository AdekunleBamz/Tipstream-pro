'use client';

import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

/**
 * Form field error type
 */
type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Form touched fields type
 */
type FormTouched<T> = Partial<Record<keyof T, boolean>>;

/**
 * Validation function type
 */
type ValidatorFn<T> = (values: T) => FormErrors<T>;

/**
 * Form options
 */
interface UseFormOptions<T> {
  initialValues: T;
  validate?: ValidatorFn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Form return type
 */
interface UseFormReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateForm: () => FormErrors<T>;
  setValues: (values: T) => void;
}

/**
 * Custom hook for form handling
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if form is dirty (values changed from initial)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  
  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;
  
  // Validate form
  const validateForm = useCallback((): FormErrors<T> => {
    if (!validate) return {};
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return validationErrors;
  }, [validate, values]);
  
  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;
      
      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
      
      if (validateOnChange && validate) {
        const newValues = { ...values, [name]: fieldValue };
        const validationErrors = validate(newValues);
        setErrors(validationErrors);
      }
    },
    [validate, validateOnChange, values]
  );
  
  // Handle input blur
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
      
      if (validateOnBlur && validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
      }
    },
    [validate, validateOnBlur, values]
  );
  
  // Handle form submit
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      
      // Touch all fields
      const allTouched = Object.keys(values).reduce((acc, key) => ({
        ...acc,
        [key]: true,
      }), {} as FormTouched<T>);
      setTouched(allTouched);
      
      // Validate
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
      
      // Submit
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );
  
  // Set field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  
  // Set field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);
  
  // Set field touched programmatically
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateForm,
    setValues,
  };
}

/**
 * Field-level validation rules
 */
export const validators = {
  required: (value: unknown): string | undefined => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
    return undefined;
  },
  
  email: (value: string): string | undefined => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email address';
    }
    return undefined;
  },
  
  minLength: (min: number) => (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return undefined;
  },
  
  maxLength: (max: number) => (value: string): string | undefined => {
    if (!value) return undefined;
    if (value.length > max) {
      return `Must be at most ${max} characters`;
    }
    return undefined;
  },
  
  min: (minVal: number) => (value: number): string | undefined => {
    if (value < minVal) {
      return `Must be at least ${minVal}`;
    }
    return undefined;
  },
  
  max: (maxVal: number) => (value: number): string | undefined => {
    if (value > maxVal) {
      return `Must be at most ${maxVal}`;
    }
    return undefined;
  },
  
  pattern: (regex: RegExp, message: string) => (value: string): string | undefined => {
    if (!value) return undefined;
    if (!regex.test(value)) {
      return message;
    }
    return undefined;
  },
  
  ethereumAddress: (value: string): string | undefined => {
    if (!value) return undefined;
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return 'Invalid Ethereum address';
    }
    return undefined;
  },
  
  positiveNumber: (value: number): string | undefined => {
    if (value <= 0) {
      return 'Must be a positive number';
    }
    return undefined;
  },
};

/**
 * Combine multiple validators
 */
export function combineValidators<T>(
  ...validatorFns: ValidatorFn<T>[]
): ValidatorFn<T> {
  return (values: T): FormErrors<T> => {
    return validatorFns.reduce((acc, validator) => {
      const errors = validator(values);
      return { ...acc, ...errors };
    }, {} as FormErrors<T>);
  };
}

export default useForm;
