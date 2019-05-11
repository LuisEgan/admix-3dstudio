export const checkNonEmptyValues = ({ values, exceptions }) => {
  const errors = {};

  for (let input in values) {
    if ((!values[input] || values[input] === '') && !exceptions.includes(input)) {
      errors[input] = 'We need this';
    }
  }

  return errors;
};
