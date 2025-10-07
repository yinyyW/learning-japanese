export type ValidateResult = {
  success: boolean;
  message?: string;
}

export class Validator {
  static emailValidate(value: string): ValidateResult {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!value) {
      return { success: false, message: 'Email is required' };
    }
    if (!emailRegex.test(value)) {
      return { success: false, message: 'Invalid email address' };
    }
    return { success: true };
  }

  static passwordValidate(value: string): ValidateResult {
    if (!value) {
      return { success: false, message: 'Password is required' };
    }
    if (value.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }
    if (value.length > 30) {
      return { success: false, message: 'Password must be at most 30 characters long' };
    }
    return { success: true };
  }

  static confirmPasswordValidate(confirmPassword: string): ValidateResult {
    if (!confirmPassword) {
      return { success: false, message: 'Confirm Password is required' };
    }
    
    return { success: true };
  }

}

export class FormField<T = string> {
  name: string;
  value: T;
  errorMsg: string | null;
  validator?: (value: T) => ValidateResult | null;
  setErrorFunc?: (msg: string | null) => void;
  setValueFunc?: (field: FormField<T>) => void;

  constructor(options: {
    name: string;
    value: T;
    errorMsg?: string | null;
    validator?: (value: T) => ValidateResult | null;
    setErrorFunc?: (msg: string | null) => void;
    setValueFunc?: (field: FormField<T>) => void;
  }) {
    this.name = options.name;
    this.value = options.value;
    this.errorMsg = options.errorMsg || null;
    this.validator = options.validator;
    this.setErrorFunc = options.setErrorFunc;
    this.setValueFunc = options.setValueFunc;
  }

  setValue(value: T) {
    this.value = value;
    this.validate();
    this.setValueFunc?.(this);
  }

  setError(message: string | null) {
    this.errorMsg = message;
    this.setErrorFunc?.(message);
    this.setValueFunc?.(this);
  }

  validate() {
    if (this.validator) {
      const result = this.validator(this.value);
      if (result) {
        this.errorMsg = result.success ? null : result.message || 'Invalid value';
        this.setErrorFunc?.(this.errorMsg);
        this.setValueFunc?.(this);
        return result.success;
      }
    }
    this.errorMsg = null;
    this.setValueFunc?.(this);
    return true;
  }

  get valid() {
    return !this.errorMsg;
  }

  reset() {
    this.value = "" as T;
    this.errorMsg = null;
    this.setValueFunc?.(this);
  }
}
