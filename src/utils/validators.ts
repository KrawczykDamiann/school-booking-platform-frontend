export const EMAIL_REGEX = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

function validateEmail(value: string) {
  if (!value) {
    return 'Email is required';
  }

  if (!EMAIL_REGEX.test(value)) {
    return 'Please enter a valid email';
  }

  return '';
}

function validatePassword(value: string) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 8) {
    return 'At least 8 characters';
  }

  return '';
}

export const validation = { validateEmail, validatePassword, EMAIL_REGEX };