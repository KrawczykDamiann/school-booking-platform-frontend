export const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

function email(value: string) {
  if (!value) {
    return 'Email is required';
  }

  if (!emailPattern.test(value)) {
    return 'Please enter a valid email';
  }

  return '';
}

function password(value: string) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 8) {
    return 'At least 8 characters';
  }

  return '';
}

export const validation = { email, password, emailPattern };