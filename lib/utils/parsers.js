export const parseErrors = error => {
  if (error.includes('duplicate key error collection')) {
    return 'User already exists!';
  }

  return error;
};
