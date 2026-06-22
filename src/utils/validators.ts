function email(value: string) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Wrong format';
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

export const validation = { email, password };