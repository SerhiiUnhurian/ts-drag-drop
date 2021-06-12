export interface Validatable {
  value: string | number;
  isRequired?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(input: Validatable) {
  const { value, isRequired, minLength, maxLength, min, max } = input;
  let isValid = true;

  if (isRequired) {
    isValid = isValid && !!value.toString().trim();
  }
  if (minLength != null && typeof value === 'string') {
    isValid = isValid && value.trim().length >= minLength;
  }
  if (maxLength != null && typeof value === 'string') {
    isValid = isValid && value.trim().length <= maxLength;
  }
  if (min != null && typeof value === 'number') {
    isValid = isValid && value >= min;
  }
  if (max != null && typeof value === 'number') {
    isValid = isValid && value <= max;
  }

  return isValid;
}
